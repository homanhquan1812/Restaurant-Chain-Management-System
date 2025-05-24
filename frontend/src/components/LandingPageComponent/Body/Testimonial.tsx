export const Testimonial = () => {
    return (
      <div className="relative flex justify-center items-center py-28 text-white">
        <img 
          loading="lazy" 
          src="/images/testimonial-bg.png" 
          alt="" 
          className="object-cover absolute inset-0 size-full" 
        />
        <div className="relative z-10 max-w-[911px] text-center px-4">
          <p className="text-xl mb-11">
            Khung cảnh nhìn từ nhà hàng rất đẹp, nội thất khác thường, đồ ăn thì tuyệt vời, dịch vụ thì tuyệt vời, tôi thích món khai vị và món tráng miệng, vịt với khoai tây rất ngon, mọi thứ đều tuyệt vời ở nhà ở Mexico, tôi chưa từng gặp như vậy cơ sở tuyệt vời, tôi chắc chắn khuyên bạn nên nó.
          </p>
          <div className="flex flex-col items-center">
            <img 
              loading="lazy" 
              src="/images/testimonial-avatar.png" 
              alt="Úc Việt" 
              className="w-28 h-28 rounded-full object-cover" 
            />
            <div className="font-semibold mt-2.5">Úc Việt</div>
            <div className="mt-2.5">Du khách</div>
          </div>
        </div>
      </div>
    );
  };