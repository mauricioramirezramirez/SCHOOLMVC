import { Container, Row, Col, Card, CardHeader, CardBody, Button, Input, PaginationItem, Pagination, PaginationLink } from "reactstrap";
import { useEffect, useState } from 'react';
import StudentTable from "./components/StudentTable";
import StudentModal from "./components/StudentModal";
import ExportToExcel from "./components/ExportExcel";

const App = () => {
    const [pagination, setPagination] = useState({
        skip: 0,
        limit: 3,
        index: 0
    });
    const [students, setStudents] = useState([]);
    const [countStudents, setCountStudents] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [edit, setEdit] = useState(null);
    const [search, setSearch] = useState("");
    const [interval, setInterval] = useState(null);
    
    const getStudents = async ({skip, limit}) => {
        console.log('->', skip, limit);
        const response = await fetch("/api/student?" + new URLSearchParams({ search, skip, limit }));

        if (!response.ok) {
            setStudents([]);
            return;
        }

        const data = await response.json();
        setStudents(data);
    }

    const getCountStudents = async () => {
        const response = await fetch("/api/student/count?" + new URLSearchParams({ search }));

        if (!response.ok) {
            setCountStudents(0);
            return;
        }

        const data = await response.json();
        setCountStudents(data);
    }

    const deleteStudent = async (id) => {
        var confirm = window.confirm("¿Deseas eliminar al estudiante?");
        if (!confirm) return;

        const response = await fetch("/api/student/" + id, {
            method: "DELETE",
        });

        if (!response.ok) return window.alert("No se ha podido eliminar al estudiante");

        window.alert("Estudiante eliminado");
        getStudents();
    };

    const saveStudent = async (student) => {
        const response = await fetch("/api/student", {
            method: "POST",
            headers: {
                'Content-Type': "application/json;charset=utf-8",
            },
            body: JSON.stringify(student),
        });

        if (!response.ok) {
            window.alert("No se ha podido registrar el estudiante");
            return;
        }

        setShowModal(!showModal);
        getStudents();
    };

    const updateStudent = async (student) => {
        const response = await fetch("/api/student", {
            method: "PATCH",
            headers: {
                'Content-Type': "application/json;charset=utf-8",
            },
            body: JSON.stringify(student),
        });

        if (!response.ok) {
            window.alert("No se ha podido actualizar el estudiante");
            return;
        }


        setShowModal(!showModal);
        getStudents();
    };

    const handleChange = () => {
        if (interval) {
            clearInterval(interval);
        }

        const timeout = setTimeout(() => {
            getStudents(pagination);
            getCountStudents();
        }, 500);

        setInterval(timeout);
    };

    const changePage = (index) => {
        setPagination({
            ...pagination, 
            skip: index * pagination.limit, 
            index
        });
        console.log('->', pagination);
        setTimeout(() => {
            console.log('->', pagination);
        }, 10000);
        handleChange();
    }

    useEffect(() => {
        handleChange();
    }, [search]);


    return (
        <Container>
            <Row className="mt-5">
                <Col sm="12">
                    <Card>
                        <CardHeader>
                            <div className="d-flex justify-content-between">
                                <h5>Estudiantes</h5>
                                <div className="d-flex gap-3">                        
                                    <Input name="email" type="text" placeholder="Buscar" onChange={(e) => setSearch(e.target.value)} value={search} /> {/* onChange={handleChange} */}
                                    <Button size="sm" color="success" onClick={() => setShowModal(!showModal)}>Agregar</Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardBody>

                            <StudentTable
                                students={students}
                                deleteStudent={deleteStudent}
                                setEdit={setEdit}
                                setShowModal={setShowModal}
                                showModal={showModal}
                                countStudents={countStudents}
                            />



                            <Pagination
                                aria-label="Page navigation example"
                                size="sm"
                            >
                                <PaginationItem>
                                    <PaginationLink
                                        first
                                        href="#"
                                    />
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationLink
                                        href="#"
                                        previous
                                    />
                                </PaginationItem>

                                {

                                    Array.from({ length: Math.ceil(countStudents / pagination.limit) }).map((_, index) => (
                                        <PaginationItem key={index} active={index === pagination.index}>
                                            <PaginationLink href="#" onClick={(e) => changePage(index)}>
                                                {index + 1}
                                            </PaginationLink>
                                        </PaginationItem>
                                    ))
                                }


                                <PaginationItem>
                                    <PaginationLink
                                        href="#"
                                        next
                                    />
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationLink
                                        href="#"
                                        last
                                    />
                                </PaginationItem>
                            </Pagination>


                        </CardBody>
                    </Card>

                </Col>
            </Row>

            <StudentModal
                showModal={showModal}
                setShowModal={setShowModal}
                saveStudent={saveStudent}
                edit={edit}
                setEdit={setEdit}
                updateStudent={updateStudent}
            />

            {'INDEX: ' + pagination.index}
            {'SKIP: ' + pagination.skip}
            {'LIMIT: ' + pagination.limit}

        </Container>
    );
}

export default App;