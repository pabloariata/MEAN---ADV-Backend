const getMenuFrontEnd = (role = 'USER_ROLE' ) =>  {

    const menu = [
        {
          titulo: 'Dashboard',
          icono: 'mdi mdi-gauge',
          subMenu: [
            {titulo: 'Main', url: ''},
            {titulo: 'ProgressBar', url: 'progress'},
            {titulo: 'Gráficas', url: 'grafica1'},
            {titulo: 'Promesas', url: 'promesas'},
            {titulo: 'RXJS', url: 'rxjs'},
          ]
        },
        {
          titulo: 'Mantenimiento',
          icono: 'mdi mdi-folder-lock-open',
          subMenu: [
            // {titulo: 'Usuarios', url: 'usuarios'},
            {titulo: 'Hospitales', url: 'hospitales'},
            {titulo: 'Medicos', url: 'medicos'},
           
          ]
        }
      ];

      if (role === 'ADMIN_ROLE') {
          menu[1].subMenu.unshift({titulo: 'Usuarios', url: 'usuarios'});
      }

      return menu;

}

module.exports = {
    getMenuFrontEnd
}