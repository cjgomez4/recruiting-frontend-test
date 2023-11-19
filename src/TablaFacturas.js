
import { Checkbox, Radio, Table } from 'semantic-ui-react';
import './App.css';

function TablaFacturas({ isNC, documentos, facturaSeleccionada, setFacturaSeleccionada, NCseleccionadas = [], setNCSeleccionadas = undefined }) {
  const cambioDolar = 873

  return (
    <Table
      textAlign='center'
      size='large'
    >
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell colSpan='4'>{isNC ? 'Selecciona una Nota de Crédito' : 'Selecciona una factura'}</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {
          documentos.length ?
            documentos?.map((el) => {
              const amountCLP = el?.currency === 'CLP' ? el?.amount : el?.amount * cambioDolar
              const amountUSD = el?.currency === 'CLP' ? Math.floor(el?.amount / cambioDolar) : el?.amount
              return (
                <Table.Row key={el?.id}>
                  <Table.Cell width={1}>
                    {
                      !isNC ?
                        <Radio
                          name='radioGroup'
                          value={el?.id}
                          key={el?.id}
                          onClick={() => setFacturaSeleccionada(el?.id)}
                          checked={facturaSeleccionada === el?.id}
                        />
                        :
                        <Checkbox
                          onClick={(_, v) => {
                            setNCSeleccionadas((current) => {
                              if (v.checked) {
                                return [...current, el?.id]
                              }
                              return current.filter(element => element !== el?.id)
                            })
                          }}
                        />
                    }
                  </Table.Cell>
                  <Table.Cell width={5}>{`${el?.id} (${el?.organization_id})`}</Table.Cell>
                  <Table.Cell width={5}>{`$${amountCLP} CLP ($${amountUSD} USD)`}</Table.Cell>
                  <Table.Cell width={5}>{!isNC ? 'Recibida' : el?.reference}</Table.Cell>
                </Table.Row>
              )
            })
            :
            <Table.Row>
              <Table.Cell colSpan='4'>No hay Notas de Crédito para asignar</Table.Cell>
            </Table.Row>
        }
      </Table.Body>
    </Table>
  )
}
export default TablaFacturas;