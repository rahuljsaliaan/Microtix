import Link from 'next/link';

function Header({ currentUser }) {
  const links = [
    !currentUser && { label: 'Sign Up', href: '/auth/signup' },
    !currentUser && { label: 'Sign In', href: '/auth/signin' },
    currentUser && { label: 'Sign Out', href: '/auth/signout' },
  ]
    .filter((link) => link)
    .map(({ label, href }) => (
      <li className="nav-item me-3" key={href}>
        <Link className="nav-link text-light" href={href}>
          {label}
        </Link>
      </li>
    ));

  return (
    <nav className="navbar navbar-dark bg-dark py-2 fixed-top">
      <div className="container-fluid">
        <Link href="/" className="nav-link d-flex flex-row">
          <img
            src="/images/logo.png"
            alt="Logo"
            style={{ width: '3rem', aspectRatio: 1 }}
          />
          <h1 className="text-info ms-3">MicroTix</h1>
        </Link>

        <div className="d-flex justify-content-end">
          <ul className="navbar-nav d-flex flex-row g-3">{links}</ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;
