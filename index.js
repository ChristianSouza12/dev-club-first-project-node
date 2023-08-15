
/* Tratamento de erros ( try catch*/

const express = require("express")
const cors = require("cors")
const uuid = require("uuid")
const app = express()
const port = 3001;
app.use(express.json())
app.use(cors())


/* 
    -Query params => meusite.com/users?nome=christian&age=28 / / FILTROS
    -Route params => /users/2  // BUSCAR, DELETAR OU ATUALIZAR ALGO ESPECIFICO
    -Request body => {"name" : "Christian" , "age":}

 
    -GET  => Buscar informacao no back end
    -POST  => Criar informação no back end
    -PUT/PATCH  => Alterar/atualizar informação no back end
    -DELETE  => Deletar informação no back end

    -Middleware -> INTERCEPTADOR => Tem o poder de parar ou alterar dados da requisição.

*/

const users = []

const checkUserId = (request, response, next) => {
    const { id } = request.params

    const index = users.findIndex(user => user.id === id)

    if (index < 0) {
        return response.status(404).json({ error: "User Not Found" })
    }
    request.userIndex = index
    request.userId = id

    next()
}


app.get("/users", (request, response) => {
    return response.json(users)
})


app.post("/users", (request, response) => {


    try{

   

    const { name, age } = request.body
    if (age<18) throw new Error ("Only allowed users over 18 years old")

    const user = { id: uuid.v4(), name, age }

    users.push(user)

    return response.status(201).json(user)
}catch(err){
    return response.status(400).json({error:err.message})
} finally{
    console.log("Terminou tudoo!!!")
}
})

app.put("/users/:id",checkUserId, (request, response) => {



    const { name, age } = request.body
    const index = request.userIndex
    const id = request.userId

    const updatedUser = { id, name, age }


    users[index] = updatedUser

    return response.json(updatedUser)
})

app.delete("/users/:id",checkUserId, (request, response) => {

    const index = request.userIndex
    users.splice(index, 1)

    return response.status(204).json()
})



app.listen(port, () => {
    console.log(` 🚀 Server started on port ${port}`)
})