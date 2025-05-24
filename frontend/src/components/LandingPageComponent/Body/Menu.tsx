// export const Menu = () => {
//     const menuItems = [
//       {
//         price: "32.000",
//         title: "Americano",
//         description: "Cà phê pha loãng bằng nước nóng, mang lại hương vị đậm đà, thường được phục vụ nóng hoặc lạnh.",
//         image: "/images/americano.png"
//       },
//       {
//         price: "42.000",
//         title: "Bánh hạnh nhân",
//         description: "Bánh ngọt mềm mại, được làm từ bột hạnh nhân, có hương vị thơm ngon và trang trí với lát hạnh nhân giòn.",
//         image: "/images/almond-cake.png"
//       },
//       {
//         price: "35.000",
//         title: "Kem Xoài",
//         description: "Món tráng miệng mát lạnh từ xoài tươi và kem, ngọt ngào và thơm mát, rất thích hợp cho mùa hè.",
//         image: "/images/mango-ice.png"
//       },
//       {
//         price: "45.000",
//         title: "Trà chanh mật ong",
//         description: "Đồ uống kết hợp trà xanh, nước cốt chanh và mật ong, thơm ngon và giải khát, tốt cho sức khỏe.",
//         image: "/images/honey-tea.png"
//       }
//     ];
  
//     return (
//       <div className="flex overflow-hidden flex-col py-20 w-full max-md:max-w-full">
//         <h2 className="text-6xl text-center text-amber-400 whitespace-nowrap min-h-[62px] max-md:text-4xl">
//           Menu
//         </h2>
//         <div className="flex flex-wrap gap-10 justify-center items-center self-center mt-32 w-full max-w-[1118px] max-md:mt-10 max-md:max-w-full">
//         <div className="flex flex-col grow shrink self-stretch my-auto min-w-[240px] w-[455px] max-md:max-w-full">
//           <img
//             loading="lazy"
//             src="/images/Menu1.png"
//             className="object-contain w-full aspect-[1.2] max-md:max-w-full"
//           />
//           <div className="mt-2.5 max-md:max-w-full">
//             <div className="flex gap-5 max-md:flex-col">
//               <div className="flex flex-col w-[59%] max-md:ml-0 max-md:w-full">
//                 <div className="flex flex-col grow max-md:mt-2.5">
//                   <img
//                     loading="lazy"
//                     src="/images/Menu2.png"
//                     className="object-contain w-full aspect-[1.03]"
//                   />
//                   <img
//                     loading="lazy"
//                     src="/images/Menu3.png"
//                     className="object-contain mt-3.5 w-full aspect-[1.08]"
//                   />
//                 </div>
//               </div>
//               <div className="flex flex-col ml-5 w-[41%] max-md:ml-0 max-md:w-full">
//                 <img
//                   loading="lazy"
//                   src="/images/Menu4.png"
//                   className="object-contain grow w-full aspect-[0.35] max-md:mt-2.5"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="flex flex-col grow shrink justify-center self-stretch my-auto min-w-[240px] w-[394px] max-md:max-w-full">
//           {menuItems.map((item, index) => (
//             <div key={index} className="flex flex-col px-6 pt-8 w-full max-md:pl-5 max-md:max-w-full">
//               <div className="pr-10 rounded-none bg-stone-700 max-md:pr-5 max-md:max-w-full">
//                 <div className="flex gap-5 max-md:flex-col">
//                   <div className="flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
//                     <div className="flex relative flex-col items-end pb-36 mt-0 text-base font-bold leading-loose text-center text-white whitespace-nowrap aspect-square w-[207px] max-md:pb-24 max-md:pl-5 max-md:-mt-3">
//                       <img loading="lazy" src={item.image} alt={item.title} className="object-cover absolute inset-0 size-full" />
//                       <div className="relative z-10 px-1 w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center">
//                         {item.price}
//                       </div>
//                     </div>
//                   </div>
//                   <div className="flex flex-col ml-5 w-6/12 max-md:ml-0 max-md:w-full">
//                     <div className="flex flex-col mt-3.5 max-md:mt-8">
//                       <div className="self-start text-xl leading-tight text-center text-amber-400">
//                         {item.title}
//                       </div>
//                       <div className="mt-2.5 text-base leading-7 text-white">
//                         {item.description}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//           <button className="flex-1 shrink gap-2.5 self-center px-6 py-2.5 mt-14 max-w-full text-sm font-bold text-center text-white bg-amber-400 rounded-[120px] w-[188px] max-md:px-5 max-md:mt-10 hover:bg-amber-500 transition-colors">
//             Xem thêm
//           </button>
//         </div>
//       </div>
//       </div>
//     );
//   };