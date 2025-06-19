import { useNavigate } from 'react-router-dom'
import ProjectForm from '../project/ProjectForm'
import styles from './NewProject.module.css'

// Funções do Firebase Realtime Database
import { db } from "../../services/firebase"
import { ref, push } from "firebase/database"

function NewProject(){

    const navigate = useNavigate()

    async function createPost(project){
        project.cost = 0
        project.services = []

        try {
            const projectsRef = ref(db, "projects")
            await push(projectsRef, project)
            const state = { message: "Projeto criado com sucesso!" }
            navigate("/projects", { state })
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className={styles.new_project_container}>
            <h1> Criar Projeto </h1>
            <p>Crie o seu projeto para depois adicionar os serviços</p>
            <ProjectForm handledSubmit={createPost} btnText="Criar Projeto"/>
        </div>
    )
}

export default NewProject
