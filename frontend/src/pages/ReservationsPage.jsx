import { useState } from 'react'
import { reservasService } from '../services/api'

const initialState = {
  fecha: '',
  hora: '',
  cantidadComensales: 2,
  observacion: '',
}

function ReservationsPage() {
  const [form, setForm] = useState(initialState)
  const [availability, setAvailability] = useState(null)
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }))

  const handleAvailability = async () => {
    try {
      const response = await reservasService.checkAvailability({
        fecha: form.fecha,
        hora: form.hora,
        cantidadComensales: form.cantidadComensales,
      })
      setAvailability(response.data)
      setMessage('Disponibilidad consultada correctamente.')
      setSuccess(true)
    } catch (error) {
      setSuccess(false)
      setMessage(error.response?.data?.message || 'No se pudo consultar la disponibilidad.')
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      await reservasService.create({
        idCliente: 1,
        ...form,
      })
      setSuccess(true)
      setMessage('Reserva registrada correctamente.')
      setForm(initialState)
      setAvailability(null)
    } catch (error) {
      setSuccess(false)
      setMessage(error.response?.data?.message || 'No se pudo registrar la reserva.')
    }
  }

  return (
    <div className="page-grid">
      <div className="page-header">
        <h2>Reservas</h2>
        <p>Consulta disponibilidad y registra reservas para el salon principal.</p>
      </div>

      <section className="reservation-layout">
        <form className="reservation-card form-grid" onSubmit={handleSubmit}>
          <div className="grid-2">
            <div>
              <label htmlFor="fecha">Fecha</label>
              <input id="fecha" min={new Date().toISOString().split('T')[0]} onChange={(event) => updateField('fecha', event.target.value)} type="date" value={form.fecha} />
            </div>
            <div>
              <label htmlFor="hora">Hora</label>
              <input id="hora" onChange={(event) => updateField('hora', event.target.value)} type="time" value={form.hora} />
            </div>
          </div>

          <div>
            <label htmlFor="cantidad">Cantidad de comensales</label>
            <input id="cantidad" min="1" onChange={(event) => updateField('cantidadComensales', event.target.value)} type="number" value={form.cantidadComensales} />
          </div>

          <div>
            <label htmlFor="observacion">Observacion</label>
            <textarea id="observacion" onChange={(event) => updateField('observacion', event.target.value)} rows="4" value={form.observacion} />
          </div>

          <div className="inline-actions">
            <button className="ghost-button" onClick={handleAvailability} type="button">
              Consultar disponibilidad
            </button>
            <button className="primary-button" type="submit">
              Registrar reserva
            </button>
          </div>

          {message ? <div className={`message ${success ? 'success' : ''}`}>{message}</div> : null}
        </form>

        <aside className="reservation-card">
          <h3>Estado del turno</h3>
          <p className="muted-text">Verifica cupos disponibles antes de confirmar una reserva.</p>
          {availability ? (
            <div className="summary-box">
              <div className="availability-box">
                <span>Fecha y hora</span>
                <strong>
                  {availability.fecha} - {availability.hora}
                </strong>
              </div>
              <div className="summary-row">
                <span>Capacidad total</span>
                <strong>{availability.capacidad_total}</strong>
              </div>
              <div className="summary-row">
                <span>Reservados</span>
                <strong>{availability.comensales_reservados}</strong>
              </div>
              <div className="summary-row summary-total">
                <span>Cupos disponibles</span>
                <strong>{availability.cupos_disponibles}</strong>
              </div>
            </div>
          ) : (
            <div className="empty-state">Aun no se ha consultado la disponibilidad.</div>
          )}
        </aside>
      </section>
    </div>
  )
}

export default ReservationsPage
