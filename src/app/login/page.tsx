import LoginBox from './components/LoginBox';
import Image from 'next/image';

import logo from '@@/public/logo.png';

export default async function Login() {
  return (
  <main className='flex flex-col items-center pt-12 font-source'>
    <Image alt='logo' src={logo} width='150' height='150' className='px-2' priority />
    <h1 className='font-light text-[32px] py-6 text-dark'>Login | Metabolica</h1>
    <LoginBox />
  </main>
  );
}
