const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="pt-8">
      <p className="text-center text-sm text-muted-foreground">
        © {currentYear} Julian Herrera - Todos los derechos reservados
      </p>
    </footer>
  );
};

export default Footer;
