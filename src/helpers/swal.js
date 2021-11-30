import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

export const successAlert = (title,time = 1500) => {
    MySwal.fire({
        title: <p>{title}</p>,
        icon:"success",
        timer:time,
    })
}

export const warningAlert = (title,time = 1500) => {
    MySwal.fire({
        title: <p>{title}</p>,
        icon:"warning",
        timer:time,
    })
}

export const errorAlert = (title,time = 1500) => {
    MySwal.fire({
        title: <p>{title}</p>,
        icon:"error",
        timer:time,
    })
}



export const questionAlert = (title,callback,time = 1500) => {
    
    Swal.fire({
        title,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
          
        if (result.isConfirmed) {
            callback();
        }
    })

}