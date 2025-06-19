import { useEffect, useState } from 'react'
import styles from './Project.module.css'
import { useParams } from 'react-router-dom'
import Loading from '../layout/Loading'
import Container from '../layout/Container'
import ProjectForm from '../project/ProjectForm'
import Message from '../layout/Message'
import ServiceForm from '../service/ServiceForm'
import {parse, v4 as uuidv4} from 'uuid'
import ServiceCard from '../service/ServiceCard'

// Funções do Firebase Realtime Database
import { db } from "../../services/firebase"
import { ref, get, update } from "firebase/database"


function Project() {
    
    const { id } = useParams()
    
    const [project, setProject] = useState([])
    const [services, setServices] = useState([])
    const [showProjectForm, setShowProjectForm] = useState(false)
    const [showServiceForm, setShowServiceForm] = useState(false)
    const [message, setMessage] = useState()
    const [type, setType] = useState()

    useEffect(() => {
        async function fetchProject() {
            try {
                const projectRef = ref(db, `projects/${id}`)
                const snapshot = await get(projectRef)
                const data = snapshot.val()
                if (data) {
                    setProject({ id, ...data })
                    setServices(data.services || [])
                }
            } catch (err) {
                console.log(err)
            }
        }
        setTimeout(fetchProject, 500)
    }, [id])    

    async function editPost(project) {
        setMessage('')
    
        // budget validation
        if (project.budget < project.cost) {
            setMessage("O orçamento não pode ser menor que o custo do projeto!")
            setType("error")
            return false
        }
    
        try {
            const projectRef = ref(db, `projects/${project.id}`)
            await update(projectRef, project)
            setProject(project)
            setShowProjectForm(false)
            setMessage("Projeto atualizado!")
            setType("success")
        } catch (err) {
            console.log(err)
        }
    }  

    async function createService(newService, project) {
        setMessage('')
        const services = project.services ? [...project.services] : []
        newService.id = uuidv4()
        const newCost = parseFloat(project.cost) + parseFloat(newService.cost)
    
        if (newCost > parseFloat(project.budget)) {
            setMessage("Orçamento ultrapassado. Verifique o valor do serviço")
            setType('error')
            return false
        }

        services.push(newService)
    
        const updatedProject = {
            ...project,
            services: services,
            cost: newCost
        }
    
        try {
            const projectRef = ref(db, `projects/${project.id}`)
            await update(projectRef, updatedProject)
            setShowServiceForm(false)
            setProject(updatedProject)
            setServices(services)
        } catch (err) {
            console.log(err)
        }
    }
    
    async function removeService(serviceId, cost) {
        setMessage('')
        const servicesUpdated = project.services.filter(
            (service) => service.id !== serviceId
        )

        const projectUpdated = {
            ...project,
            services: servicesUpdated,
            cost: parseFloat(project.cost) - parseFloat(cost)
        }

        try {
            const projectRef = ref(db, `projects/${project.id}`)
            await update(projectRef, projectUpdated)
            setProject(projectUpdated)
            setServices(servicesUpdated)
            setMessage("Serviço removido com sucesso.")
            setType("success")
        } catch (err) {
            console.log(err)
        }
    }


    function toggleProjectForm(){
        setShowProjectForm(!showProjectForm)
    }

    function toggleServiceForm(){
        setShowServiceForm(!showServiceForm)
    }

    return (
        <>
            {project.name ? (
            
                <div className={styles.project_details}>
                    <Container customClass="column">
                        {message && <Message type={type} msg={message}/>} 
                         <div className={styles.details_container}>
                            <h1>Projeto: {project.name}</h1>
                            <button className={styles.btn} onClick={toggleProjectForm}>
                                {!showProjectForm ? "Editar Projeto" : "Fechar"}
                            </button>
                            {!showProjectForm ? (
                                <div className={styles.project_info}>
                                    <p>
                                        <span>Categoria: {project.category.name}</span>
                                    </p>
                                    <p>
                                        <span>Total de Orçamento: {project.budget}</span>
                                    </p>
                                    <p>
                                        <span>Total Utilizado: {project.cost}</span>
                                    </p>
                                </div>
                            ) : (
                                <div className={styles.project_info}>
                                    <ProjectForm handledSubmit={editPost} btnText="Concluir Edição" projectData={project}/>
                                </div>
                            )}
                         </div>
                         <div className={styles.service_form_container}>
                            <h2>Adicione um serviço</h2>
                            <button className={styles.btn} onClick={toggleServiceForm}>
                                {!showServiceForm ? "Adicionar Serviço" : "Fechar"}
                            </button>
                            <div className={styles.project_info}>
                                {showServiceForm && (
                                    <ServiceForm
                                    handleSubmit={(service) => createService(service, project)}
                                    textBtn="Adicionar serviço"
                                    projectData={project}
                                    />
                                )}
                            </div>
                         </div>
                         <h2>Serviços</h2>
                         <Container customClass="start">
                           {services.length > 0 &&
                                services.map((service) => (
                                    <ServiceCard
                                    id={service.id}
                                    name={service.name}
                                    cost={service.cost}
                                    description={service.description}
                                    key={service.id}
                                    handleRemove={removeService}
                                    />
                                ))
                           }
                           {services.length === 0 && <p>Não há serviços cadastrados</p>

                           }
                         </Container>
                    </Container>
                </div>
            )
            : ( <Loading/> )} 
        </>
    )
}

export default Project