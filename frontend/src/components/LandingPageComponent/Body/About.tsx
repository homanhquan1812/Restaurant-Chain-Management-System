// export const About = () => {
//     const stats = [
//       { value: "93", label: "Đồ uống" },
//       { value: "206", label: "Đồ tráng miệng" },
//       { value: "71", label: "Chi nhánh" }
//     ];
  
//     return (
//       // <div className="flex flex-wrap gap-10 items-center justify-center py-20">
//       //   <div className="flex flex-col justify-between items-center self-stretch my-auto h-[343px] min-w-[240px] text-zinc-800 w-[444px] max-md:max-w-full">
//       //     <div className="flex flex-col px-1.5 w-full">
//       //       <h2 className="text-4xl mb-7 max-md:text-4xl">Lịch sử của chúng tôi</h2>
//       //       <p className="text-base text-center">
//       //         Chuỗi cửa hàng cà phê Utopia ra đời năm 2010, bắt đầu từ một quán nhỏ và nhanh chóng mở rộng nhờ cà phê chất lượng và không gian thư giãn. Với triết lý kết hợp hương vị tinh tế và phong cách hiện đại, Utopia đã phát triển thành một thương hiệu được yêu thích trên toàn quốc.
//       //       </p>
//       //       <div className="flex gap-8 justify-center items-center mt-20 text-center">
//       //         {stats.map((stat, index) => (
//       //           <div key={index} className="flex flex-col">
//       //             <div className="text-4xl">{stat.value}</div>
//       //             <div className="text-xl">{stat.label}</div>
//       //           </div>
//       //         ))}
//       //       </div>
//       //     </div>
//       //   </div>
//       //   <div className="flex-1 min-w-[240px] max-w-[539px]">
//       //     <img 
//       //       loading="lazy" 
//       //       src="/images/abouthistory.png" 
//       //       alt="Utopia History" 
//       //       className="object-contain w-full aspect-[1.11]" 
//       //     />
//       //   </div>
//       // </div>
//       <div className="flex flex-col justify-between pt-20 mt-2.5 w-full min-h-[971px] max-md:max-w-full">
//       <div className="flex flex-wrap gap-10 items-center self-center max-md:max-w-full">
//         <div className="flex flex-col justify-between items-center self-stretch my-auto h-[343px] min-w-[240px] text-zinc-800 w-[444px] max-md:max-w-full">
//           <div className="flex flex-col px-1.5 w-full max-w-[444px] max-md:max-w-full">
//             <div className="ml-4 text-5xl max-md:mr-1.5 max-md:ml-2.5 max-md:text-4xl">
//               Lịch sử của chúng tôi
//             </div>
//             <div className="mt-7 text-base text-center max-md:max-w-full">
//               Chuỗi cửa hàng cà phê Utopia ra đời năm 2010, bắt đầu từ một quán
//               nhỏ và nhanh chóng mở rộng nhờ cà phê chất lượng và không gian thư
//               giãn. Với triết lý kết hợp hương vị tinh tế và phong cách hiện
//               đại, Utopia đã phát triển thành một thương hiệu được yêu thích
//               trên toàn quốc.
//             </div>
//             <div className="flex gap-8 justify-center items-center mt-20 text-center">
//                {stats.map((stat, index) => (
//                  <div key={index} className="flex flex-col">
//                    <div className="text-4xl">{stat.value}</div>
//                   <div className="text-xl">{stat.label}</div>
//                  </div>
//                ))}
//             </div>
//           </div>
//         </div>
//         <div className="flex flex-col self-stretch my-auto min-w-[240px] w-[539px] max-md:max-w-full">
//           <img
//             loading="lazy"
//             src="/images/abouthistory.png"
//             alt="Utopia Coffee Shop History"
//             className="object-contain w-full aspect-[1.11] max-md:max-w-full"
//           />
//         </div>
//       </div>
//       <div className="w-full bg-stone-300 mt-16">
//         <div className="container mx-auto px-5 md:px-20 py-24 relative min-h-[347px]">
//           <div className="absolute inset-0">
//             <img
//               loading="lazy"
//               src="/images/Banner-delicious.png"
//               alt="Utopia Coffee Shop Location"
//               className="object-cover w-full h-full"
//             />
//             <div className="absolute inset-0 bg-black bg-opacity-80" />
//           </div>
//           <div className="relative flex flex-col items-center justify-center gap-7 max-w-4xl mx-auto text-center">
//             <h2 className="text-5xl text-amber-400 max-md:text-4xl">
//               Gặp gỡ nói chuyện ở 1 nơi có không gian yên tĩnh, ấm cúng nhất.
//             </h2>
//             <p className="text-2xl font-bold text-white">
//               Cùng với nhiều thức uống và bánh kem ngon miệng.
//             </p>
//             <button 
//               aria-label="Xem địa chỉ"
//               className="px-12 py-2.5 bg-yellow-600 rounded-[120px] text-sm font-bold text-white hover:bg-yellow-700 transition-colors"
//             >
//               Địa chỉ
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//     );
//   };