import React, { useEffect, useRef, useState } from 'react';
import Spinner from '@modules/common/icons/spinner';
import axios from 'axios';



interface EnEsperaTrackingProps {
    codigoSeguimiento: string;
    mensaje?: string;
}

const EnEsperaTracking: React.FC<EnEsperaTrackingProps> = ({codigoSeguimiento, mensaje}) => {
    const [images, setImages] = useState<string[]>([]);
    const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;
    const a=useRef(0);
    
    useEffect(() => {
        const fetchImages = async () => {
            const response = await axios.get(`${baseUrl}/admin/contenidoEducativo?tipoContenido=Imagen`);
            const contenidos = response.data.contenidoEducativos;
            let urls: string[] = [];
            for (const contenido of contenidos) {
                // They are like https://drive.google.com/uc?export=view&id=1PGt3vhQeNpy9HyHOInyMM1EfRJDkbutI. We need to convert them to https://drive.google.com/thumbnail?id=15OPb_x_a9kkmTUfxXeDf_dHHuimzR4OS&sz=w500
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
            <h6 style={styles.heading}>{mensaje}</h6>
            <Spinner />
            <p style={styles.body}>Cuando tu pedido esté en camino, podrás seguirlo en tiempo real.</p>
            <p style={styles.body}>Tu código de seguimiento es:</p>
            <h6 style={styles.heading}>{codigoSeguimiento}</h6>
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
        fontSize: '1.5rem',
        color: '#B88E2F', // mostazaTexto
        maxWidth: '70%',
    },
    body: {
        marginTop: '8px',
        fontSize: '1rem',
        color: '#333333', // negroTitulo
    },
};

export default EnEsperaTracking;