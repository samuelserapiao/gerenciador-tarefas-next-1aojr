import type { NextPage } from "next";
import { useState } from "react";
import { executeRequest } from "../services/api";
import { Modal } from "react-bootstrap";

type LoginProps = {
    setToken(s: string): void
}

export const Login: NextPage<LoginProps> = ({ setToken }) => {

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [passwordRegister, setPasswordResgister] = useState('');
    const [loadingRegister, setLoadingRegister] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const doLogin = async () => {
        try {
            setError('');
            if (!login || !password) {
                setError('Favor preencher os campos!');
                return
            }

            setLoading(true);

            const body = {
                login,
                password
            };

            const result = await executeRequest('login', 'post', body);
            if (result && result.data) {
                const obj = result.data;
                localStorage.setItem('accessToken', obj.token);
                localStorage.setItem('name', obj.name);
                localStorage.setItem('email', obj.email);
                setToken(obj.token);
            }
        } catch (e: any) {
            console.log(`Erro ao efetuar login: ${e}`);
            if (e?.response?.data?.error) {
                setError(e.response.data.error);
            } else {
                setError(`Erro ao efetuar login, tente novamente.`);
            }
        }

        setLoading(false);
    }

    const closeModal = () => {
        setShowModal(false);
        setLoadingRegister(false);
        setErrorMsg('');
        setName('');
        setEmail('');
        setPasswordResgister('');
    }

    const doSave = async () => {
        try {
            setErrorMsg('');
            if (!name || !email || !passwordRegister) {
                setErrorMsg('Favor preencher os campos!');
                return
            }

            setLoadingRegister(true);

            const body = {
                name,
                email,
                password: passwordRegister
            }

            await executeRequest('user', 'post', body);

            closeModal();
        } catch (e: any) {
            console.log(`Erro ao cadastrar usuário: ${e}`);
            if (e?.response?.data?.error) {
                setErrorMsg(e.response.data.error);
            } else {
                setErrorMsg(`Erro ao cadastrar usuário, tente novamente.`);
            }
        }

        setLoadingRegister(false);
    }

    return (<>
        <div className="container-login">
            <img src="/logo.svg" alt="Logo Fiap" className="logo" />
            <div className="form">
                {error && <p className="error">{error}</p>}
                <div className="input">
                    <img src="/mail.svg" alt="Login Icone" />
                    <input type='text' placeholder="Login"
                        value={login}
                        onChange={evento => setLogin(evento.target.value)}
                    />
                </div>
                <div className="input">
                    <img src="/lock.svg" alt="Senha Icone" />
                    <input type='password' placeholder="Senha"
                        value={password}
                        onChange={evento => setPassword(evento.target.value)}
                    />
                </div>
                <button onClick={doLogin} disabled={loading}>{loading ? '...Carregando' : 'Login'}</button>
                <button onClick={() => setShowModal(true)}>Cadastrar</button>
            </div>
        </div>
        <Modal
            show={showModal}
            className="container-modal">
            <Modal.Body>
                <p>Cadastrar usuário</p>
                {errorMsg && <p className="error">{errorMsg}</p>}
                <input type='text' placeholder="Nome" value={name} onChange={e => setName(e.target.value)} />
                <input type='text' placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} />
                <input type='password' placeholder="Senha" value={passwordRegister} onChange={e => setPasswordResgister(e.target.value)} />
            </Modal.Body>
            <Modal.Footer>
                <div className="button col-12">
                    <button onClick={doSave} disabled={loadingRegister}>{loadingRegister ? '...Salvando' : 'Cadastrar'}</button>
                    <span onClick={closeModal}>Cancelar</span>
                </div>
            </Modal.Footer>
        </Modal>
    </>
    );
}