interface LoadingProps {
    visible?: boolean;
  }
  
  export default function Loading({ visible }: LoadingProps) {
    if (!visible) return null;
  
    return (
      <div className="fixed inset-0 z-[100002] bg-gray-900 bg-opacity-50 flex justify-center items-center">
        <div className="relative w-20 h-20 mx-auto my-5">
          <div className="w-full h-full rounded-full border-[6px] border-white border-t-transparent animate-spin"></div>
        </div>
      </div>
    )
  }
  