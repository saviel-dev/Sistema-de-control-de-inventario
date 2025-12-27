import { supabase } from '@/lib/supabase';

/**
 * Script de diagnóstico para verificar el estado de Realtime
 * Ejecutar desde la consola del navegador
 */
export const diagnoseRealtime = () => {
  console.log('🔍 === DIAGNÓSTICO DE REALTIME INICIADO ===\n');

  // 1. Verificar canales activos
  const channels = supabase.getChannels();
  console.log(`📡 Canales Realtime activos: ${channels.length}`);
  
  if (channels.length === 0) {
    console.warn('⚠️ No hay canales activos. Las suscripciones pueden no estar configuradas.');
  } else {
    channels.forEach((channel, index) => {
      console.log(`\n  📻 Canal ${index + 1}:`);
      console.log(`     Topic: ${channel.topic}`);
      console.log(`     Estado: ${channel.state}`);
      console.log(`     Sub-topic: ${channel.subTopic || 'N/A'}`);
    });
  }

  // 2. Crear canal de prueba
  console.log('\n🧪 Creando canal de prueba para inventario_detallado...\n');
  
  const testChannel = supabase
    .channel('test-diagnostic-inventario-detallado')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'inventario_detallado' },
      (payload) => {
        console.log('🎉 === EVENTO RECIBIDO ===');
        console.log('Tipo:', payload.eventType);
        console.log('Tabla:', payload.table);
        console.log('Datos nuevos:', payload.new);
        console.log('Datos antiguos:', payload.old);
        console.log('=========================\n');
      }
    )
    .subscribe((status) => {
      console.log(`📊 Estado de suscripción: ${status}`);
      
      switch (status) {
        case 'SUBSCRIBED':
          console.log('✅ Suscripción exitosa! Ahora intenta eliminar un producto del inventario detallado.');
          console.log('   Deberías ver un evento aquí arriba cuando lo hagas.\n');
          break;
        case 'CHANNEL_ERROR':
          console.error('❌ Error en el canal. Posibles causas:');
          console.error('   1. Realtime no está habilitado en el proyecto de Supabase');
          console.error('   2. La tabla no tiene Realtime habilitado');
          console.error('   3. Problemas de red/conexión\n');
          break;
        case 'TIMED_OUT':
          console.error('⏱️ Timeout en la suscripción. Verifica tu conexión a internet.\n');
          break;
        case 'CLOSED':
          console.log('🔒 Canal cerrado.\n');
          break;
      }
    });

  // Guardar en window para poder limpiarlo después
  window.__realtimeTestChannel = testChannel;

  console.log('📝 Para limpiar el canal de prueba, ejecuta en la consola:');
  console.log('   window.supabase.removeChannel(window.__realtimeTestChannel)\n');

  console.log('📋 Checklist de verificación:');
  console.log('   □ Realtime habilitado en proyecto Supabase (Database > Replication)');
  console.log('   □ Tabla "inventario_detallado" tiene Realtime habilitado');
  console.log('   □ Políticas RLS permiten SELECT en la tabla');
  console.log('   □ Conexión WebSocket activa (Network tab > WS)\n');

  return {
    testChannel,
    cleanup: () => {
      supabase.removeChannel(testChannel);
      console.log('✅ Canal de prueba eliminado');
    }
  };
};

// Exportar para uso en consola
if (typeof window !== 'undefined') {
  window.diagnoseRealtime = diagnoseRealtime;
  console.log('💡 Función diagnoseRealtime() disponible en la consola del navegador');
}
