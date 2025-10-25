
// Image assets from Figma
const imgFrame1686553080 = "http://localhost:3845/assets/94112899ef626c166b51f0af371c20748c3f5386.png"
const imgHome1 = "http://localhost:3845/assets/d76cd30487587ada0c1736c160d316ea17b8da1e.png"

const DashboardPreview = () => {
  return (
    <div className="bg-white flex-1 flex flex-col gap-4 items-start p-6 relative rounded shrink-0 h-full">
      <div className="grow min-h-px min-w-px overflow-clip relative rounded w-full">
        {/* Background with gradient overlay */}
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded">
          <img 
            alt="" 
            className="absolute max-w-none object-50%-50% object-cover rounded size-full" 
            src={imgFrame1686553080} 
          />
          <div 
            className="absolute inset-0 rounded" 
            style={{ 
              backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 364 469\\' preserveAspectRatio=\\'none\\'><g transform=\\'matrix(6.0498e-15 23.45 -18.2 6.6237e-15 182 234.5)\\'><foreignObject x=\\'-190\\' y=\\'-190\\' width=\\'380\\' height=\\'380\\'><div xmlns=\\'http://www.w3.org/1999/xhtml\\' style=\\'background-image: conic-gradient(from 90deg, rgba(138, 149, 255, 1) 0%, rgba(104, 118, 255, 1) 25%, rgba(69, 87, 255, 1) 50%, rgba(35, 56, 255, 1) 75%, rgba(17, 41, 255, 1) 87.5%, rgba(0, 25, 255, 1) 100%); opacity:1; height: 100%; width: 100%;\\'></div></foreignObject></g></svg>')" 
            }} 
          />
        </div>
        
        {/* Dashboard mockup */}
        <div className="absolute h-[450.688px] left-[42px] rounded shadow-[0px_4px_100px_0px_rgba(0,0,0,0.25)] top-[calc(50%+163.844px)] translate-y-[-50%] w-[754.799px]">
          <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded">
            <img 
              alt="" 
              className="absolute max-w-none object-50%-50% object-cover rounded size-full" 
              src={imgHome1} 
            />
            <div className="absolute inset-0 rounded" />
          </div>
        </div>
        
        {/* Overlay text */}
        <p 
          className="absolute bg-clip-text font-bold leading-8 left-1/2 text-2xl text-center top-[35px] tracking-[-0.24px] translate-x-[-50%] w-[364px]" 
          style={{ WebkitTextFillColor: "transparent" }}
        >
          All your insights.
          <br aria-hidden="true" />
          One clean dashboard
        </p>
      </div>
    </div>
  )
}

export default DashboardPreview
