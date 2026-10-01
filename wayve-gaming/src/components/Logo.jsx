import blackLogo from '../assets/heroimage/black-logo.png';
import logo from '../assets/heroimage/logo.png';

export default function Logo({ size = 48, variant = 'navbar' }) {
  const width = variant === 'footer' ? size * 2.4 : size * 2.7;

  return (
    <>
      <img
        src={blackLogo}
        alt="Wayve Gaming"
        width={width}
        height={size}
        className="h-auto dark:hidden"
        style={{ width: `${width}px` }}
        draggable="false"
      />
      <img
        src={logo}
        alt=""
        aria-hidden="true"
        width={width}
        height={size}
        className="hidden h-auto dark:block"
        style={{ width: `${width}px` }}
        draggable="false"
      />
    </>
  );
}