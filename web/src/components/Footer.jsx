const Footer = () => {
  return (
    <footer className="footer footer-center bg-base-200/50 backdrop-blur-sm border-t border-base-content/5 p-6 text-base-content/50">
      <aside>
        <p className="text-sm">
          Made with{" "}
          <span className="text-pink-500 animate-pulse inline-block">❤️</span>{" "}
          by{" "}
          <span className="font-semibold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            Shashi Kant
          </span>{" "}
          — DevTinder © {new Date().getFullYear()}
        </p>
      </aside>
    </footer>
  );
};

export default Footer;
