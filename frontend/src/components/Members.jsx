import { Form } from "react-router-dom";

export default function Members () {
    return (
        <main className="members">
        <h1>Members</h1>
        <section className="memberbox">
            <Form method="post">
                <label htmlFor="invite"></label>
                <input name="invite" type="text" placeholder="invite using email"/>
                <button>invite</button>
            </Form>
            <section className="memberlist">
            </section>
        </section>
        </main>
    )
}