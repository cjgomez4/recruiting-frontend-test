import './App.css';
import 'semantic-ui-css/semantic.min.css'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Modal } from 'semantic-ui-react';
import TablaFacturas from './TablaFacturas';


function App() {

  const [facturas, setFacturas] = useState([])
  const [notasCredito, setNotasCredito] = useState([])
  const [facturaSeleccionada, setFacturaSeleccionada] = useState()
  const [NCSeleccionadas, setNCSeleccionadas] = useState([])
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const fetchData = async () => {

      await axios.get('https://recruiting.api.bemmbo.com/invoices/pending')
        .then(response => {
          try {
            setFacturas(response?.data?.filter(doc => doc?.type === 'received'))
            setNotasCredito(response?.data?.filter(doc => doc?.type === 'credit_note'))
          } catch (e) {
            console.error(e.message)
          }
        })
        .catch(e => {
          console.error(e.message)
        })
    }
    fetchData()
  }, [])

  return (
    <div className='main-container'>
      <TablaFacturas
        isNC={false}
        documentos={facturas}
        facturaSeleccionada={facturaSeleccionada}
        setFacturaSeleccionada={setFacturaSeleccionada}
      />
      {
        facturaSeleccionada ?
          <div>
            <TablaFacturas
              isNC={true}
              documentos={notasCredito.filter(doc => doc?.reference === facturaSeleccionada)}
              facturaSeleccionada={facturaSeleccionada}
              setFacturaSeleccionada={setFacturaSeleccionada}
              NCSeleccionadas={NCSeleccionadas}
              setNCSeleccionadas={setNCSeleccionadas}
            />
          </div>
          : []
      }
      {
        NCSeleccionadas.length ?
          <div className='button-container'>
            <Button
              content={'Asignar'}
              disabled={!NCSeleccionadas.length}
              onClick={() => {
                setShowModal(true)
                setNotasCredito((current) => current.filter(el => !NCSeleccionadas.includes(el.id)))
                setNCSeleccionadas([])
                setFacturaSeleccionada()
              }}
            />
          </div>
          : []
      }
      {showModal ?
        <Modal
          size='mini'
          open={showModal}
          centered={true}
        >
          <Modal.Header>Nota de crédito asignada correctamente!</Modal.Header>
          <Modal.Actions>
            <Button
              positive
              onClick={() => setShowModal(false)}>
              Seguir asignando
            </Button>
          </Modal.Actions>
        </Modal>
        : []
      }
    </div>
  );
}

export default App;
