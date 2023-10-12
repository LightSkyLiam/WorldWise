import { useNavigate } from "react-router-dom";
import PageNav from "../Components/PageNav";
import styles from "./Login.module.css";
import { useEffect, useState } from "react";
import { useAuth } from "../Contexts/FakeAuthContext";
import Button from "../Components/Button";
import Message from "../Components/Message";

export default function Login() {
  // PRE-FILL FOR DEV PURPOSES
  const [email, setEmail] = useState("jack@example.com");
  const [password, setPassword] = useState("qwerty");
  const { login, isAuthenticated, error } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) login(email, password);
  };
  useEffect(() => {
    if (isAuthenticated) navigate(`/app`, { replace: true });
  }, [isAuthenticated, navigate]);

  return (
    <main className={styles.login}>
      <PageNav />
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.row}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>

        <div>
          <Button type="primary">Login</Button>
        </div>
      </form>
      {error && <Message message={error} />}
    </main>
  );
}
