// Script para verificar el estado de las suscripciones Realtime de Supabase
// Ejecutar en la consola del navegador para diagnosticar problemas

console.log('🔍 Verificando configuración de Realtime...');

// 1. Verificar que Supabase está cargado
if (typeof window !== 'undefined') {
  console.log('✅ Entorno del navegador detectado');
  
  // 2. Verificar canales activos
  const channels = window?.supabase?.getChannels?.() || [];
  console.log(`📡 Canales Realtime activos: ${channels.length}`);
  channels.forEach((channel, index) => {
    console.log(`  Canal ${index + 1}:`, {
      topic: channel.topic,
      state: channel.state,
      subTopic: channel.subTopic,
    });
  });

  // 3. Intentar crear canal de prueba
  console.log('🧪 Creando canal de prueba...');
  
  const testChannel = window.supabase
    ?.channel('test-realtime-diagnostic')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'inventario_detallado' },
      (payload) => {
        console.log('🎉 EVENTO RECIBIDO EN inventario_detallado:', payload);
      }
    )
    .subscribe((status) => {
      console.log(`📊 Estado de suscripción de prueba: ${status}`);
      
      if (status === 'SUBSCRIBED') {
        console.log('✅ Suscripción de prueba exitosa');
      } else if (status === 'CHANNEL_ERROR') {
        console.error('❌ Error en canal de prueba');
      } else if (status === 'TIMED_OUT') {
        console.error('⏱️ Timeout en suscripción de prueba');
      }
    });

  // 4. Verificar configuración de Realtime
  console.log('⚙️ Configuración de Realtime:');
  console.log('  - URL:', window.supabase?.supabaseUrl);
  console.log('  - Realtime habilitado:', !!window.supabase?.realtime);

  // 5. Instrucciones para limpiar
  console.log('\n📝 Para limpiar el canal de prueba, ejecuta:');
  console.log('window.supabase.removeChannel(window.testChannel)');
  
  window.testChannel = testChannel;
} else {
  console.error('❌ No se puede acceder al objeto window');
}

console.log('\n📋 Notas importantes:');
console.log('1. Verifica que Realtime esté habilitado en tu proyecto de Supabase');
console.log('2. Verifica que la tabla "inventario_detallado" tenga Realtime habilitado');
console.log('3. Verifica que las políticas RLS no bloqueen los eventos Realtime');
console.log('4. Abre la pestaña Network en DevTools y busca conexiones WebSocket');
