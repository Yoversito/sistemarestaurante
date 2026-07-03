import { CalendarDays, Clock3, ConciergeBell, MessageSquareText, Users } from 'lucide-react'
import { useState } from 'react'
import EmptyState from '../components/EmptyState'
import { reservasService } from '../services/api'

const initialState = {
  fecha: '',
  hora: '',
  cantidadComensales: 2,
  observacion: '',
}

function ReservationsPage({ embedded = false, reportData = [], snapshot = null }) {
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
      <section className="page-banner">
        <div>
          <span className="eyebrow">{embedded ? 'Modulo de reservas' : 'Reservas'}</span>
          <h2>Gestiona las reservas del salon</h2>
        </div>
      </section>

      <section className="reservation-layout">
        <form className="reservation-card form-grid" onSubmit={handleSubmit}>
          <div className="panel-headline">
            <div>
              <h3>Formulario de reserva</h3>
            </div>
            <div className="icon-chip">
              <ConciergeBell size={18} />
            </div>
          </div>

          <div className="grid-2 reservation-form-grid">
            <div className="icon-input">
              <CalendarDays size={18} />
              <div>
                <label htmlFor="fecha">Fecha</label>
                <input id="fecha" min={new Date().toISOString().split('T')[0]} onChange={(event) => updateField('fecha', event.target.value)} type="date" value={form.fecha} />
              </div>
            </div>

            <div className="icon-input">
              <Clock3 size={18} />
              <div>
                <label htmlFor="hora">Hora</label>
                <input id="hora" onChange={(event) => updateField('hora', event.target.value)} type="time" value={form.hora} />
              </div>
            </div>
          </div>

          <div className="icon-input">
            <Users size={18} />
            <div>
              <label htmlFor="cantidad">Cantidad de comensales</label>
              <input id="cantidad" min="1" onChange={(event) => updateField('cantidadComensales', event.target.value)} type="number" value={form.cantidadComensales} />
            </div>
          </div>

          <div className="icon-input textarea-field">
            <MessageSquareText size={18} />
            <div>
              <label htmlFor="observacion">Observacion</label>
              <textarea id="observacion" onChange={(event) => updateField('observacion', event.target.value)} rows="4" value={form.observacion} />
            </div>
          </div>

          <div className="inline-actions inline-actions-stretch">
            <button className="ghost-button" onClick={handleAvailability} type="button">
              <Clock3 size={16} />
              Consultar disponibilidad
            </button>
            <button className="primary-button" type="submit">
              <CalendarDays size={16} />
              Registrar reserva
            </button>
          </div>

          {message ? <div className={`message ${success ? 'success' : ''}`}>{message}</div> : null}
        </form>

        <aside className="reservation-card reservation-side-panel">
          <div className="panel-headline">
            <div>
              <h3>Estado del turno</h3>
            </div>
            <div className="icon-chip">
              <Users size={18} />
            </div>
          </div>

          {availability ? (
            <div className="reservation-side-grid">
              <div className="availability-box availability-hero">
                <span>Fecha y hora</span>
                <strong>
                  {availability.fecha} - {availability.hora}
                </strong>
              </div>
              <div className="availability-box">
                <span>Capacidad total</span>
                <strong>{availability.capacidad_total}</strong>
              </div>
              <div className="availability-box">
                <span>Reservados</span>
                <strong>{availability.comensales_reservados}</strong>
              </div>
              <div className="availability-box">
                <span>Cupos disponibles</span>
                <strong>{availability.cupos_disponibles}</strong>
              </div>
            </div>
          ) : (
            <EmptyState
              icon={CalendarDays}
              title="Aun no se ha consultado la disponibilidad"
            />
          )}

          {embedded ? (
            <div className="reservation-admin-summary">
              <div className="panel-headline reservation-summary-headline">
                <div>
                  <h3>Resumen administrativo</h3>
                </div>
              </div>

              <div className="reservation-side-grid reservation-side-grid-tight">
                <div className="availability-box availability-hero">
                  <span>Turno referencial</span>
                  <strong>
                    {snapshot?.fecha || 'Sin fecha'} - {snapshot?.hora || 'Sin hora'}
                  </strong>
                </div>
                <div className="availability-box">
                  <span>Reservados</span>
                  <strong>{snapshot?.comensales_reservados || 0}</strong>
                </div>
                <div className="availability-box">
                  <span>Cupos disponibles</span>
                  <strong>{snapshot?.cupos_disponibles || 0}</strong>
                </div>
              </div>

              {reportData.length ? (
                <div className="report-list reservation-report-list">
                  {reportData.slice(0, 5).map((item) => (
                    <div className="summary-row" key={item.fecha}>
                      <span>{item.fecha}</span>
                      <strong>{item.ocupabilidad_porcentaje}%</strong>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
        </aside>
      </section>
    </div>
  )
}

export default ReservationsPage
