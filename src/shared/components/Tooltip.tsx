import { useRef, useState } from "react";
import ReactDOM from "react-dom";

interface TooltipProps {
    title?: string
    message?: React.ReactNode
    children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ title, message, children }) => {
    const [visible, setVisible] = useState<boolean>(false);
    const [coords, setCoords] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
    const targetRef = useRef<HTMLDivElement | null>(null);

    const showTooltip = () => {
        if (targetRef.current) {
            const rect = targetRef.current.getBoundingClientRect();
            setCoords({
                top: rect.top + window.scrollY + 40, // Posicionar el tooltip abajo
                left: rect.left + window.scrollX + rect.width / 2, // Centrar horizontalmente
            });
        }
        setVisible(true);
    };

    const hideTooltip = () => setVisible(false);

    return (
        <div
            className="block relative"
            onMouseEnter={showTooltip}
            onMouseLeave={hideTooltip}
            ref={targetRef}
        >
            {children}
            {visible &&
                ReactDOM.createPortal(
                    <div
                        className="absolute max-w-[250px] hyphens-auto text-wrap flex flex-col gap-1 bg-opacity-80 bg-cyan-500 shadow-md text-white p-2 rounded whitespace-nowrap z-50 opacity-90 text-sm pointer-events-none transition-opacity duration-600 ease-in-out"
                        style={{
                            position: 'absolute',
                            top: `${coords.top}px`,
                            left: `${coords.left}px`,
                            transform: 'translateX(-50%)',
                        }}
                    >
                        <div className="absolute top-[-6px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-cyan-500"></div>
                        {title && <p className="font-bold">{title}</p>}
                        {message}
                    </div>,
                    document.body
                )}
        </div>
    );

};

export default Tooltip;