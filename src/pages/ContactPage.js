import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, MessageCircle, Store } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const ContactPage = () => {
  const { state } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    contactType: 'general'
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simular envío del formulario
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        contactType: 'general'
      });
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Error al enviar el mensaje. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const sucursales = [
    {
      id: 1,
      name: 'Casa Matriz - Santiago Centro',
      address: 'Av. Libertador Bernardo O\'Higgins 1234, Santiago',
      phone: '+56 2 2345 6789',
      email: 'centro@ferremas.cl',
      hours: 'Lun-Vie: 08:00-19:00, Sáb: 09:00-14:00',
      region: 'Metropolitana'
    },
    {
      id: 2,
      name: 'Sucursal Las Condes',
      address: 'Av. Apoquindo 4567, Las Condes',
      phone: '+56 2 2876 5432',
      email: 'lascondes@ferremas.cl',
      hours: 'Lun-Vie: 08:30-18:30, Sáb: 09:00-13:00',
      region: 'Metropolitana'
    },
    {
      id: 3,
      name: 'Sucursal Maipú',
      address: 'Av. Américo Vespucio 7890, Maipú',
      phone: '+56 2 2234 5678',
      email: 'maipu@ferremas.cl',
      hours: 'Lun-Vie: 08:00-18:00, Sáb: 09:00-14:00',
      region: 'Metropolitana'
    },
    {
      id: 4,
      name: 'Sucursal Puente Alto',
      address: 'Av. Concha y Toro 1234, Puente Alto',
      phone: '+56 2 2987 6543',
      email: 'puentealto@ferremas.cl',
      hours: 'Lun-Vie: 08:00-18:00, Sáb: 09:00-13:00',
      region: 'Metropolitana'
    },
    {
      id: 5,
      name: 'Sucursal Valparaíso',
      address: 'Av. Argentina 2345, Valparaíso',
      phone: '+56 32 234 5678',
      email: 'valparaiso@ferremas.cl',
      hours: 'Lun-Vie: 08:30-18:00, Sáb: 09:00-13:00',
      region: 'Valparaíso'
    },
    {
      id: 6,
      name: 'Sucursal Concepción',
      address: 'Av. O\'Higgins 3456, Concepción',
      phone: '+56 41 234 5678',
      email: 'concepcion@ferremas.cl',
      hours: 'Lun-Vie: 08:00-18:00, Sáb: 09:00-13:00',
      region: 'Biobío'
    },
    {
      id: 7,
      name: 'Sucursal La Serena',
      address: 'Av. Francisco de Aguirre 4567, La Serena',
      phone: '+56 51 234 5678',
      email: 'laserena@ferremas.cl',
      hours: 'Lun-Vie: 08:30-18:00, Sáb: 09:00-13:00',
      region: 'Coquimbo'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Contacto</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Estamos aquí para ayudarte. Contacta a nuestros especialistas o visita cualquiera de nuestras 7 sucursales.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Formulario de Contacto */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <MessageCircle className="mr-3 text-blue-900" size={24} />
            Envíanos un Mensaje
          </h2>

          {submitted ? (
            <div className="text-center py-8">
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                <strong>¡Mensaje enviado exitosamente!</strong>
                <p className="text-sm mt-1">Nos contactaremos contigo dentro de las próximas 24 horas.</p>
              </div>
              <button 
                onClick={() => setSubmitted(false)}
                className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition-colors"
              >
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Nombre completo *"
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Correo electrónico *"
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Teléfono"
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
                <select
                  name="contactType"
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.contactType}
                  onChange={handleInputChange}
                >
                  <option value="general">Consulta General</option>
                  <option value="quote">Solicitar Cotización</option>
                  <option value="support">Soporte Técnico</option>
                  <option value="complaint">Reclamo</option>
                  <option value="suggestion">Sugerencia</option>
                </select>
              </div>

              <input
                type="text"
                name="subject"
                placeholder="Asunto *"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.subject}
                onChange={handleInputChange}
                required
              />

              <textarea
                name="message"
                placeholder="Mensaje *"
                rows={6}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.message}
                onChange={handleInputChange}
                required
              ></textarea>

              <button
                onClick={handleSubmit}
                disabled={loading || !formData.name || !formData.email || !formData.subject || !formData.message}
                className="w-full bg-blue-900 text-white py-3 rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <Send size={18} />
                <span>{loading ? 'Enviando...' : 'Enviar Mensaje'}</span>
              </button>

              <p className="text-sm text-gray-600 text-center">
                Los campos marcados con * son obligatorios
              </p>
            </div>
          )}
        </div>

        {/* Información de Contacto */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">Información de Contacto</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="text-blue-900 flex-shrink-0" size={20} />
                <div>
                  <p className="font-semibold">Teléfono Principal</p>
                  <p className="text-gray-600">+56 2 2345 6789</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="text-blue-900 flex-shrink-0" size={20} />
                <div>
                  <p className="font-semibold">Email General</p>
                  <p className="text-gray-600">contacto@ferremas.cl</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="text-blue-900 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="font-semibold">Casa Matriz</p>
                  <p className="text-gray-600">
                    Av. Libertador Bernardo O'Higgins 1234<br />
                    Santiago, Chile
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="text-blue-900 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="font-semibold">Horarios de Atención</p>
                  <p className="text-gray-600">
                    <strong>Lunes a Viernes:</strong> 08:00 - 19:00<br />
                    <strong>Sábados:</strong> 09:00 - 14:00<br />
                    <strong>Domingos:</strong> Cerrado
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-xl font-bold text-blue-900 mb-4">¿Necesitas asesoría especializada?</h3>
            <p className="text-gray-700 mb-4">
              Nuestros expertos en ferretería y construcción están disponibles para ayudarte a encontrar 
              exactamente lo que necesitas para tu proyecto.
            </p>
            <div className="space-y-2 text-sm">
              <p><strong>Asesoría en Herramientas:</strong> Ext. 101</p>
              <p><strong>Materiales de Construcción:</strong> Ext. 102</p>
              <p><strong>Ventas Corporativas:</strong> Ext. 103</p>
              <p><strong>Servicio al Cliente:</strong> Ext. 104</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sucursales */}
      <div className="bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-8 flex items-center justify-center">
          <Store className="mr-3 text-blue-900" size={28} />
          Nuestras 7 Sucursales
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sucursales.map(sucursal => (
            <div key={sucursal.id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-bold text-lg mb-2 text-blue-900">{sucursal.name}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start space-x-2">
                  <MapPin size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700">{sucursal.address}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone size={16} className="text-gray-500 flex-shrink-0" />
                  <p className="text-gray-700">{sucursal.phone}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail size={16} className="text-gray-500 flex-shrink-0" />
                  <p className="text-gray-700">{sucursal.email}</p>
                </div>
                <div className="flex items-start space-x-2">
                  <Clock size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700">{sucursal.hours}</p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t">
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  Región {sucursal.region}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-600 mb-4">
            ¿No encuentras una sucursal cerca de ti? ¡Tenemos planes de expansión en todo Chile!
          </p>
          <button className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition-colors">
            Suscríbete para ser notificado de nuevas sucursales
          </button>
        </div>
      </div>

      {/* Mapa o información adicional */}
      <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">¿Cómo podemos ayudarte?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="text-blue-900" size={24} />
            </div>
            <h3 className="font-bold mb-2">Consultas Generales</h3>
            <p className="text-gray-600 text-sm">
              Información sobre productos, precios, disponibilidad y servicios
            </p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Phone className="text-green-700" size={24} />
            </div>
            <h3 className="font-bold mb-2">Asesoría Técnica</h3>
            <p className="text-gray-600 text-sm">
              Ayuda especializada para elegir las herramientas adecuadas para tu proyecto
            </p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Store className="text-purple-700" size={24} />
            </div>
            <h3 className="font-bold mb-2">Visita Presencial</h3>
            <p className="text-gray-600 text-sm">
              Ven a conocer nuestros productos en cualquiera de nuestras 7 sucursales
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;