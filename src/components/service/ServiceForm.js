import styles from '../project/ProjectForm.module.css'
import Input from '../form/Input'
import SubmitButton from '../form/SubmitButton'
import { useState } from 'react'

function ServiceForm({handleSubmit, textBtn}) {
    const [service, setService] = useState({})

    function submit(e){
        e.preventDefault()
        handleSubmit(service)
    }

    function handleOnChange(e){
        setService({...service, [e.target.name]: e.target.value})
    }

    return (
        <form onSubmit={submit} className={styles.form}>
            <Input
                type="text"
                text="Nome do serviço"
                name="name"
                placeholder="Insira o nome do serviço"
                handleOnChange={handleOnChange}
            />
            <Input
                type="number"
                text="Custo do serviço"
                name="cost"
                placeholder="Insira o valor total"
                handleOnChange={handleOnChange}
            />
            <Input
                type="text"
                text="Descrição do serviço"
                name="description"
                placeholder="Insira a descrição do serviço"
                handleOnChange={handleOnChange}
            />
            <SubmitButton text={textBtn}/>
        </form>
    )
}

export default ServiceForm