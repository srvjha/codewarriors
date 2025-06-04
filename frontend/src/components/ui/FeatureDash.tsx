import Lottie from 'react-lottie';
import animationData from '../../../dashboard.json';

const FeatureDash = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid meet',
    },
  };

  return (
    <div className="w-full overflow-hidden  ">
      <Lottie
        options={defaultOptions}
        height={'100%'}
        width={'100%'}
        isClickToPauseDisabled
      />
    </div>
  );
};

export default FeatureDash;
