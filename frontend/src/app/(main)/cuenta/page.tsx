"use client";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Cuenta = () => {
  const { data: session, status } = useSession();
  const [userNombre, setUserNombre] = useState('');
  const [userApellido, setUserApellido] = useState('');
  const [userCorreo, setUserCorreo] = useState('');
  const [userTelefono, setUserTelefono] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function fetchUserName() {
      if (session?.user?.id) {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/admin/usuario/${session.user.id}`);
          console.log("response", response);
          const user = response.data.usuario;
          if (user) {
            setUserNombre(user.nombre);
            setUserApellido(user.apellido);
            setUserCorreo(user.correo);
            setUserTelefono(user.numerotelefono);
          } else {
            console.error('Failed to fetch user name');
          }
        } catch (error) {
          console.error('Error fetching user name:', error);
        }
      }
	  else{
		router.push('/');
	  }
    }

    fetchUserName();
  }, [session]);

  if (!session?.user?.id) {
    return null; // Return null while redirecting
  }

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1, padding: '20px' }}>
        <h2>Datos generales</h2>
        {/* User details go here */}
      </div>
      <div style={{ flex: 1, padding: '20px' }}>
        <h2>Direcciones Guardadas</h2>
        {/* Saved addresses go here */}
      </div>
    </div>
  );
};

export default Cuenta;