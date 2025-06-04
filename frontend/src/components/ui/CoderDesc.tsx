
import Lottie from 'react-lottie';
import  animationData from '../../../coder.json';

const CoderDesc = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <Lottie
      options={defaultOptions}
      height={500}
      width={500}
    />
  );
};

export default CoderDesc;
