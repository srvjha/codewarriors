import Lottie from 'react-lottie';
import animationData from '../../../coder.json';

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
    <div className="w-full h-auto max-w-[500px] mx-auto">
      <Lottie options={defaultOptions} />
    </div>
  );
};

export default CoderDesc;
