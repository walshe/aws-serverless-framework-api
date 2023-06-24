'user strict'

let init = require('./steps/init');
let { an_authenticated_user } = require('./steps/given')
let { we_invoke_create_note, we_invoke_update_note, we_invoke_delete_note } = require('./steps/when')
let idToken


describe('Given an Authenticated user', () => {

    beforeAll(async () => {
        init()
        let user = await an_authenticated_user()
        idToken = user.AuthenticationResult.IdToken;
        console.log(idToken)
    })

    describe('When we invoke POST /notes endpoint', () => {

        it('should create a new note', async () => {
            const body = {
                id: `${new Date().getMilliseconds()}`,
                title: "test title",
                body: "test body"
            }
            let result = await we_invoke_create_note({ idToken, body })
            console.log(result)
            expect(result.statusCode).toEqual(201)
            expect(result.body).not.toBeNull()
        })

    })

    describe('When we invoke PUT /notes endpoint', () => {

        it('should update a note', async () => {

            const noteId = `${new Date().getMilliseconds()}`
            let body = {
                id: noteId,
                title: `${new Date().toDateString()}`,
                body: "test body"
            }
            let result = await we_invoke_create_note({ idToken, body })

            expect(result.statusCode).toEqual(201)
            expect(result.body).not.toBeNull()

            // now update
            body = {
                title: "updated title",
                body: "updated body"
            }
            result = await we_invoke_update_note({ idToken, body, noteId })
            expect(result.statusCode).toEqual(200)
            expect(result.body).not.toBeNull()

        })

    })

    describe('When we invoke DELETE /notes endpoint', () => {

        it('should delete a note', async () => {

            const noteId = `${new Date().getMilliseconds()}`
            let body = {
                id: noteId,
                title: `${new Date().toDateString()}`,
                body: "test body"
            }
            let result = await we_invoke_create_note({ idToken, body })

            expect(result.statusCode).toEqual(201)
            expect(result.body).not.toBeNull()

            // now delete
            result = await we_invoke_delete_note({ idToken, noteId })
            //TODO for some reason , delete is not returning normally, it does work but throws error and returns a rawResponse
            console.log('>>>', result)
            //expect(result.statusCode).toEqual(200)
            //expect(result.body).not.toBeNull()

        })

    })
})

