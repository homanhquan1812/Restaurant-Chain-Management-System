// export const Features = () => {
//     const features = [
//       {
//         icon: "/images/feature1.png",
//         title: "Không gian",
//         highlight: "sang trọng",
//         description: "Không gian quán cà phê được thiết kế ấm cúng và thoáng đãng; ánh sáng tự nhiên kết hợp với trang trí tinh tế tạo cảm giác thư giãn, dễ chịu."
//       },
//       {
//         icon: "/images/feature2.png",
//         title: "Thực phẩm",
//         highlight: "chất lượng",
//         description: "Nguyên liệu tươi mới, chất lượng, an toàn thực phẩm"
//       },
//       {
//         icon: "/images/feature3.png",
//         title: "Dịch vụ",
//         highlight: "chu đáo",
//         description: "Dịch vụ quán cà phê gồm đồ uống chất lượng, nhân viên thân thiện, phục vụ chuyên nghiệp và không gian thoải mái, phù hợp để thư giãn."
//       }
//     ];
  
//     return (
//       <div className="flex flex-wrap gap-4 justify-center items-center px-16 py-10 w-full text-2xl text-zinc-800 max-md:px-5 max-md:max-w-full">
//         {features.map((feature, index) => (
//           <div key={index} className="flex flex-col justify-between items-center self-stretch px-4 pt-6 my-auto bg-amber-200 rounded-lg shadow-2xl min-h-[400px] min-w-[240px] w-[349px]">
//             <div className="flex flex-col flex-1 justify-center items-center w-full max-w-[317px]">
//               <img loading="lazy" src={feature.icon} alt="" className="object-contain aspect-square w-[87px]" />
//               <div className="gap-2.5 self-stretch text-center mt-2.5 font-bold">
//                 {feature.title} <span className="text-blue-600">{feature.highlight}</span>
//               </div>
//               <div className="flex-1 shrink gap-2.5 self-stretch mt-2.5 text-center size-full text-lg px-4 py-4">
//                 {feature.description}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     );
//   };