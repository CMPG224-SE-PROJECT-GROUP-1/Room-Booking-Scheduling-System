import { useState } from "react";
import Field from "../components/Field";
import Button from "../components/Button";
import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";
import './LoginPage.css';
import { Link } from "react-router-dom"; 

export function LoginPage() {
  const [uniNumber, setUniNumber] = useState('');
  const [name, setName] = useState('')
  const [password, setPassword] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    alert("SIGNED IN!");
  }

  return (
    <div className="page-wrapper">

      <main className="login-page">
        <section className="login-left">
          <form className="login-form" onSubmit={handleSubmit}>
            <h1>Sign In!</h1>

            <Field
              id="name"
              label="Name and Surname"
              placeholder="e.g Neo Masebe"
              value = {name}
              onChange={(e) => setName(e.target.value)}

          />

            <Field
              id="univeristy-number"
              label="University Number"
              placeholder="S123456"
              value={uniNumber}
              onChange={(e) => setUniNumber(e.target.value)}
            />

            <Field
              id="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit">Sign In</Button>

            <div className="links">
              <Link to="/forgotpassword" className="nav-link">
                Forgot your password?
              </Link>
              <Link to="/signup" className="nav-link">
                Create new account
              </Link>
            </div>
          </form>
        </section>

        <section className="login-right">
          <h2>HELLO</h2>
        </section>
      </main>
    </div>
  );
}