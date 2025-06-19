import { useEffect, useState } from 'react'
import Input from '../form/Input'
import Select from '../form/Select'
import SubmitButton from '../form/SubmitButton'
import styles from './ProjectForm.module.css'

// Funções do Firebase Realtime Database
import { db } from "../../services/firebase"
import { ref, get } from "firebase/database"

function ProjectForm({handledSubmit, btnText, projectData}) {

    const [categories, setCategories] = useState([])
    const [project, setProject] = useState(projectData || {})

    useEffect(() => {
        async function fetchCategories() {
            try {
                const categoriesRef = ref(db, "categories")
                const snapshot = await get(categoriesRef)
                const data = snapshot.val()
                if (data) {
                    // Transforma objeto em array
                    const categoriesList = Object.entries(data).map(([key, value]) => ({
                        id: key,
                        name: value.name,
                    }))
                    setCategories(categoriesList)
                } else {
                    setCategories([])
                }
            } catch (err) {
                console.log(err)
            }
        }
        fetchCategories()
    }, [])

    const submit = (e) => {
        e.preventDefault()
        handledSubmit(project)
    }

    function handleChange(e){
        setProject({ ...project, [e.target.name]: e.target.value})
    }

    function handleCategory(e){
        setProject({ ...project, category: {
           id: e.target.value,
           name: e.target.options[e.target.selectedIndex].text,
        }})
    }

    return (
        <form onSubmit={submit} className={styles.form}>
            <Input type="text" text="Nome do projeto" name="name" placeholder="Insira o nome do projeto" handleOnChange={handleChange} value={project.name ? project.name : ''}/>
            <Input type="number" text="Orçamento do projeto" name="budget" placeholder="Insira o orçamento total" handleOnChange={handleChange} value={project.budget ? project.budget : ''}/>
            <Select name="category_id" text="Selecione a categoria" options={categories} handleOnChange={handleCategory} value={project.category ? project.category.id : ''}/>
            <SubmitButton text={btnText}/>
        </form>
    )
}

export default ProjectForm
