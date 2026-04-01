import Image from 'next/image';
import spinner from '@/app/assets/spinner.svg';

export default function Spinner() {

  return (
    <div className='flex justify-center h-screen items-center bg-black bg-opacity-20'>
        <Image className='w-[100px] rounded-full' src={spinner} width={100} height={100} alt='spinner'/>
    </div>
  )
}
