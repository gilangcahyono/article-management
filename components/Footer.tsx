/* eslint-disable @next/next/no-img-element */
const Footer = () => {
  return (
    <footer className="bg-blue-500 flex justify-center items-center gap-3 py-7 flex-col sm:flex-row">
      <img src="/logo.svg" alt="LogoIpsum" className="w-32" />
      <p className="text-white text-sm text-center">
        &copy; 2025 Blog M. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
