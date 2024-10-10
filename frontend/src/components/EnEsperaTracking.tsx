import React from 'react';
import Spinner from '@modules/common/icons/spinner';

const berenjena="/images/berenjena.png";
const cebolla="/images/cebolla.png";
const pera="/images/pera.png";
const pinon="/images/pinon.png";
const tomate="/images/tomate.png";
const zanahoria="/images/zanohoria.png";


interface EnEsperaTrackingProps {
    codigoSeguimiento: string;
}

const EnEsperaTracking: React.FC<EnEsperaTrackingProps> = ({codigoSeguimiento}) => {
    const images = [berenjena, cebolla, pera, pinon, tomate, zanahoria];
    const duplicatedImages = images.concat(images);

    return (
        <div style={styles.container}>
            <div style={styles.fallingImagesContainer}>
                {duplicatedImages.map((src, index) => (
                    <img
                        key={index}
                        src={src}
                        style={{
                            ...styles.fallingImage,
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                        }}
                        alt={`falling-${index}`}
                    />
                ))}
            </div>
            <div style={{ zIndex: 2 }} className='flex flex-col items-center bg-white p-4 rounded-lg shadow-lg'>
            <h6 style={styles.heading}>Tu pedido está en espera</h6>
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
    },
    body: {
        marginTop: '8px',
        fontSize: '1rem',
        color: '#333333', // negroTitulo
    },
};

export default EnEsperaTracking;