import { DriveStep } from "driver.js";

export const tourSteps: DriveStep[] = [
  {
    element: '[data-tour="sidebar"]',
    popover: {
      title: "¡Bienvenido a GastroFlow Manager! 🎉",
      description:
        "Este es tu panel de navegación principal. Desde aquí puedes acceder a todas las funcionalidades del sistema. Te guiaré paso a paso por cada sección.",
      side: "right",
      align: "start",
    },
  },
  {
    element: '[data-tour="dashboard-link"]',
    popover: {
      title: "📊 Dashboard",
      description:
        "El Dashboard es tu centro de control. Aquí verás estadísticas en tiempo real: total de productos, tasa de cambio BCV, valor del inventario y alertas de bajo stock.",
      side: "right",
      align: "start",
    },
  },
  {
    element: '[data-tour="inventario-general-link"]',
    popover: {
      title: "📦 Insumos Generales",
      description:
        "Gestiona todos tus productos desde aquí. Puedes agregar nuevos productos, editar información, actualizar precios, gestionar stock y eliminar productos. Es tu catálogo maestro.",
      side: "right",
      align: "start",
    },
  },
  {
    element: '[data-tour="inventario-detallado-link"]',
    popover: {
      title: "📍 Insumos Detallados",
      description:
        "Organiza tus productos por ubicaciones específicas (almacén, cocina, bar, etc.). Aquí puedes ver qué productos tienes en cada lugar y gestionar el stock por ubicación.",
      side: "right",
      align: "start",
    },
  },
  {
    element: '[data-tour="movimientos-link"]',
    popover: {
      title: "🔄 Movimientos",
      description:
        "Registra todas las entradas y salidas de productos. Mantén un historial completo de movimientos con fechas, cantidades, razones y responsables. Perfecto para auditorías.",
      side: "right",
      align: "start",
    },
  },
  {
    element: '[data-tour="reportes-link"]',
    popover: {
      title: "📈 Reportes",
      description:
        "Genera informes detallados y análisis de tu inventario. Exporta datos en PDF o Excel, visualiza gráficos y obtén insights valiosos sobre tu negocio.",
      side: "right",
      align: "start",
    },
  },
  {
    element: '[data-tour="notificaciones-link"]',
    popover: {
      title: "🔔 Notificaciones",
      description:
        "Mantente al tanto de todo lo que sucede en tu sistema. Recibe alertas de bajo stock, confirmaciones de operaciones y notificaciones importantes en tiempo real.",
      side: "right",
      align: "start",
    },
  },
  {
    element: '[data-tour="configuracion-link"]',
    popover: {
      title: "⚙️ Configuración",
      description:
        "Personaliza el sistema a tu gusto. Cambia el tema (claro/oscuro), configura tu perfil, gestiona datos del sistema y ajusta preferencias generales.",
      side: "right",
      align: "start",
    },
  },
  {
    element: '[data-tour="user-profile"]',
    popover: {
      title: "👤 Tu Perfil",
      description:
        "Aquí puedes ver tu información de usuario. Desde Configuración puedes actualizar tu avatar, nombre y otros datos personales.",
      side: "top",
      align: "center",
    },
  },
  {
    popover: {
      title: "✅ ¡Tour Completado!",
      description:
        'Ahora conoces todas las funcionalidades principales del sistema. Puedes volver a ver este tour en cualquier momento haciendo clic en el botón "Cómo usar" en el encabezado. ¡Éxito gestionando tu inventario! 🚀',
    },
  },
];

export const tourConfig = {
  showProgress: true,
  progressText: "{{current}} de {{total}}",
  nextBtnText: "Siguiente →",
  prevBtnText: "← Anterior",
  doneBtnText: "¡Entendido! ✓",
  closeBtnText: "Cerrar",
  showButtons: ["next", "previous", "close"],
  allowClose: true,
  overlayClickNext: false,
  smoothScroll: true,
  animate: true,
  overlayOpacity: 0.7,
  stagePadding: 10,
  stageRadius: 8,
};
