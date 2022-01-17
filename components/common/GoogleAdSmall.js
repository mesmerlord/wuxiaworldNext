import React, { useEffect } from "react";

const GoogleAdSmall = ({ pageParam, adNum }) => {
  useEffect(() => {
    const pushAd = () => {
      try {
        const adsbygoogle = window.adsbygoogle;
        adsbygoogle.push({});
      } catch (e) {
        console.error(e);
      }
    };

    let interval = setInterval(() => {
      if (window.adsbygoogle) {
        pushAd();
        clearInterval(interval);
      }
    }, 50);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <ins
      className={`adsbygoogle`}
      style={{
        display: "block",
      }}
      data-ad-client="ca-pub-5752282235723884"
      data-ad-slot="1866634958"
      data-ad-format="auto"
      data-full-width-responsive="true"
      key={`small-add-${pageParam}-${adNum}`}
    />
  );
};
export default React.memo(GoogleAdSmall);
