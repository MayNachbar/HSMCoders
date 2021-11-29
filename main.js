'use strict'

const openModal = () => document.getElementById('modal')
    .classList.add('active')

const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')
}


const getLocalStorage = () => JSON.parse(localStorage.getItem('db_course')) ?? []
const setLocalStorage = (dbCourse) => localStorage.setItem("db_course", JSON.stringify(dbCourse))

// CRUD - create read update delete
const createCourse = (course) => {
    const dbCourse = getLocalStorage()
    dbCourse.push (course)
    setLocalStorage(dbCourse)
}

const readCourse = () => getLocalStorage()

const updateCourse = (index, course) => {
    const dbCourse = readCourse()
    dbCourse[index] = course
    setLocalStorage(dbCourse)
}

const deleteCourse = (index) => {
    const dbCourse = readCourse()
    dbCourse.splice(index, 1)
    setLocalStorage(dbCourse)
}

const isValidFields = () => {
    return document.getElementById('form').reportValidity()
}

//Interação com o layout

const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
    document.getElementById('titulo').dataset.index = 'new'
}

const saveCourse = () => {
    debugger
    if (isValidFields()) {
        const course = {
            numero: document.getElementById('numero').value,
            titulo: document.getElementById('titulo').value,
            descricao: document.getElementById('descricao').value,
            nomeProfessor: document.getElementById('nomeProfessor').value,
            listaAulas: document.getElementById('listaAulas').value
        }
        const index = document.getElementById('titulo').dataset.index
        if (index == 'new') {
            createCourse(course)
            updateTable()
            closeModal()
        } else {
            updateCourse(index, course)
            updateTable()
            closeModal()
        }
    }
}

const createRow = (course, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td>${course.numero}</td>
        <td>${course.titulo}</td>
        <td>${course.descricao}</td>
        <td>${course.nomeProfessor}</td>
        <td>${course.listaAulas}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}" >Excluir</button>
        </td>
    `
    document.querySelector('#tableCourse>tbody').appendChild(newRow)
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tableCourse>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
    const dbCourse = readCourse()
    clearTable()
    dbCourse.forEach(createRow)
}

const fillFields = (course) => {
    document.getElementById('numero').value = course.numero
    document.getElementById('titulo').value = course.titulo
    document.getElementById('descricao').value = course.descricao
    document.getElementById('nomeProfessor').value = course.nomeProfessor
    document.getElementById('listaAulas').value = course.listaAulas
    document.getElementById('titulo').dataset.index = course.index
}

const editCourse = (index) => {
    const course = readCourse()[index]
    course.index = index
    fillFields(course)
    openModal()
}

const editDelete = (event) => {
    if (event.target.type == 'button') {

        const [action, index] = event.target.id.split('-')

        if (action == 'edit') {
            editCourse(index)
        } else {
            const course = readCourse()[index]
            const response = confirm(`Deseja realmente excluir o curso ${course.titulo}`)
            if (response) {
                deleteCourse(index)
                updateTable()
            }
        }
    }
}

updateTable()

// Eventos
document.getElementById('cadastrarCurso')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

document.getElementById('salvar')
    .addEventListener('click', saveCourse)

document.querySelector('#tableCourse>tbody')
    .addEventListener('click', editDelete)

document.getElementById('cancelar')
    .addEventListener('click', closeModal)