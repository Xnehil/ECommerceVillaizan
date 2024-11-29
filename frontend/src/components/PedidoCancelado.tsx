import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pedido } from 'types/PaquetePedido';
import axios from 'axios';



const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;

interface PedidoCanceladoProps {
    // Define your props here
    pedido: Pedido | null;
  }
  

  const PedidoCancelado: React.FC<PedidoCanceladoProps> = ({ pedido }) => {
    const router = useRouter();
    const [images, setImages] = useState<string[]>([]);
    const a=useRef(0);

    useEffect(() => {
        const fetchImages = async () => {
            const response = await axios.get(`${baseUrl}/admin/contenidoEducativo?tipoContenido=Imagen`);
            const contenidos = response.data.contenidoEducativos;
            let urls: string[] = [];
            for (const contenido of contenidos) {
                const id = contenido.URLContenido.split("id=")[1];
                urls.push(`https://drive.google.com/thumbnail?id=${id}&sz=w400`);
            }
            // Only 8 random images 
            urls = urls.sort(() => Math.random() - 0.5).slice(0, 8);
            urls=urls.concat(urls);
            setImages(urls);
        }
        if (a.current===0){
            fetchImages();
            a.current=1;
        }
    }, []);


    const handleRetry = async () => {
        if(!pedido){
            router.push('/');
            return;
        }
        const response = await axios.put(`${baseUrl}/admin/pedido/${pedido.id}`,{estado: "carrito"});
        if(response.status !== 200){
            console.error("Error al intentar reintentar el pedido");
            router.push('/');
            return;
        }
        console.log("Pedido reintentado");
        // Copy pedido cookie to cart cookie
        document.cookie = "_medusa_cart_id=" + document.cookie.replace(/(?:(?:^|.*;\s*)_medusa_pedido_id\s*\=\s*([^;]*).*$)|^.*$/, "$1") + ";max-age=3600;path=/";
        // Delete pedido cookie
        document.cookie = "_medusa_pedido_id=;max-age=-1;path=/";
        
        router.push('/carrito');
    };

    const handleGoHome = () => {
        // Delete pedido cookie
        document.cookie = "_medusa_pedido_id=;max-age=-1;path=/";
        router.push('/');
    };

    return (
        <div style={styles.container}>
            <div style={styles.fallingImagesContainer}>
                {images.map((src, index) => (
                    <img
                        key={index}
                        src={src}
                        style={{
                            ...styles.fallingImage,
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                        }}
                        alt={``}
                    />
                ))}
            </div>
            <div style={{ zIndex: 2 }} className='flex flex-col items-center bg-white p-4 rounded-lg shadow-lg w-1/2'>
                <h6 style={styles.heading}>
                     Nuestros administradores no han podido verificar tu pedido. Por favor, inténtalo de nuevo 😢
                </h6>
                <div className='flex space-x-4 mt-4'>
                    <button onClick={handleRetry} style={styles.button}>Intentar de nuevo</button>
                    <button onClick={handleGoHome} style={styles.button}>Volver a la página principal</button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column' as 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        textAlign: 'center' as 'center',
        padding: '16px',
        backgroundColor: '#F9F1E7', // cremaFondo
        position: 'relative' as 'relative',
        overflow: 'hidden' as 'hidden',
        zIndex: 0,
    },
    fallingImagesContainer: {
        position: 'absolute' as 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'none' as 'none',
    },
    fallingImage: {
        position: 'absolute' as 'absolute',
        width: '5%',
        height: 'auto',
        animation: 'fall 10s linear infinite, fadeIn 1s forwards',
        opacity: 0,
    },
    heading: {
        marginTop: '4px',
        marginBottom: '0.5rem',
        fontSize: '1.2rem',
        maxWidth: '60%',
    },
    button: {
        padding: '8px 16px',
        fontSize: '1rem',
        color: '#FFFFFF',
        backgroundColor: '#B88E2F', // mostazaTexto
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
};

export default PedidoCancelado;