import Swal from 'sweetalert2';

export const showSuccessMessage = (message) => {
  Swal.fire({
    icon: 'success',
    title: 'Success!',
    text: message,
    confirmButtonText: 'OK',
    confirmButtonColor: '#10B981',
    background: '#1F2937',
    color: '#FFFFFF',
  });
};

export const showErrorMessage = (message) => {
  Swal.fire({
    icon: 'error',
    title: 'Error!',
    text: message,
    confirmButtonText: 'OK',
    confirmButtonColor: '#EF4444',
    background: '#1F2937',
    color: '#FFFFFF',
  });
};

export const showInfoMessage = (message) => {
  Swal.fire({
    icon: 'info',
    title: 'Info',
    text: message,
    confirmButtonText: 'OK',
    confirmButtonColor: '#3B82F6',
    background: '#1F2937',
    color: '#FFFFFF',
  });
};
