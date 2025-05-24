import React from "react";

export const Footer = () => {
  const links = {
    products: ['Drinks', 'Cakes'],
    branches: ['UTOPIA - Quận 1', 'UTOPIA - Thủ Đức'],
    social: ['facebook', 'instagram', 'twitter'],
    legal: ['Data settings', 'Cookie settings', 'Privacy Policy', 'Terms And Conditions', 'Imprint']
  };

  return (
    <footer className="bg-stone-900 text-white py-9 px-32 max-md:px-5">
      <div className="border-t-2 border-white pt-12">
        <div className="flex flex-wrap gap-10 justify-between mb-20">
          <div>
            <h3 className="text-3xl font-bold mb-2.5">Products</h3>
            {links.products.map(item => (
              <div key={item} className="mt-2.5 text-xl">{item}</div>
            ))}
          </div>
          
          <div>
            <h3 className="text-3xl font-bold mb-5">Branches</h3>
            {links.branches.map(branch => (
              <div key={branch} className="mt-5 text-xl">{branch}</div>
            ))}
          </div>

          <div>
            <h3 className="text-3xl font-bold mb-4">Follow us</h3>
            <div className="flex gap-2.5">
              {links.social.map(platform => (
                <a 
                  key={platform} 
                  href={`#${platform}`}
                  className="hover:opacity-80 transition-opacity"
                >
                  <img 
                    loading="lazy" 
                    src={`/images/${platform}.png`} 
                    alt={`${platform} icon`}
                    className="w-6 aspect-square" 
                  />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-3xl font-bold mb-4">Map</h3>
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.504638894081!2d106.65512307583832!3d10.77260825926248!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752ec17709146b%3A0x54a1658a0639d341!2zxJDhuqFpIEjhu41jIELDoWNoIEtob2EgLSAyNjggTMO9IFRoxrDhu51uZyBLaeG7h3Q!5e0!3m2!1sen!2s!4v1734106188455!5m2!1sen!2s"
                className="mt-4 w-full h-[200px] border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Utopia Cafe Location"
              /> 
          </div>
        </div>

        <div className="flex flex-wrap gap-9 justify-center text-xl">
          {links.legal.map(item => (
            <a 
              key={item} 
              href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
              className="hover:underline"
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};
