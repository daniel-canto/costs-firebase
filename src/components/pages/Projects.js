import Message from "../layout/Message"
import { useLocation } from "react-router-dom"
import { useState, useEffect } from 'react'
import styles from './Projects.module.css'
import Container from "../layout/Container"
import LinkButton from "../layout/LinkButton"
import ProjectCard from "../project/ProjectCard"
import Loading from "../layout/Loading"

// Funções do Firebase Realtime Database
import { db } from "../../services/firebase"
import { ref, onValue, remove } from "firebase/database"

function Projects(){

    const [projects, setProjects] = useState([])
    const [removeLoading, setRemoveLoading] = useState(true)
    const [projectMessage, setProjectMessage] = useState('')

    const location = useLocation()
    let message = ''
    if(location.state) {
        message = location.state.message
    }

    useEffect(() => {
        const projectsRef = ref(db, "projects")
        // Adiciona um pequeno delay para simular carregamento
        const timer = setTimeout(() => {
            onValue(projectsRef, (snapshot) => {
                const data = snapshot.val()
                if (data) {
                    // Transforma objeto em array
                    const projectsArray = Object.entries(data).map(([key, value]) => ({
                        id: key,
                        ...value
                    }))
                    setProjects(projectsArray)
                } else {
                    setProjects([])
                }
                setRemoveLoading(false)
            }, (error) => {
                console.log(error)
                setRemoveLoading(false)
            })
        }, 1200)

        // Cleanup do timer
        return () => clearTimeout(timer)
    }, [])

    async function removeProject(id) {
        try {
            await remove(ref(db, `projects/${id}`))
            setProjects(projects.filter((project) => project.id !== id))
            setProjectMessage('Projeto removido com sucesso')
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className={styles.project_container}>
            <div className={styles.title_container}>
                <h1>Meus Projetos</h1>
                <LinkButton to="/newproject" text="Criar Projeto"/>
            </div>
            {message && <Message type="success" msg={message}/>}
            {projectMessage && <Message type="success" msg={projectMessage}/>}
            <Container customClass="start">
                {projects.length > 0 &&
                    projects.map((project) => (
                        <ProjectCard
                        id={project.id} 
                        name={project.name}
                        budget={project.budget}
                        category={project.category?.name || project.category_name}
                        key={project.id}
                        handleRemove={removeProject}
                        />
                    ))
                }
                {removeLoading && <Loading/>}
                {!removeLoading && projects.length === 0 && (
                    <p>Não há projetos cadastrados!</p>
                )}
            </Container>
        </div>
    )
}

export default Projects