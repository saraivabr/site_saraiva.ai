import { motion } from 'framer-motion'
import { useState } from 'react'
import { Send, MessageCircle, Mail, CheckCircle, Loader2 } from 'lucide-react'

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Open WhatsApp with the message
    const whatsappMessage = `Olá! Sou ${formData.name} (${formData.email}). ${formData.message}`
    window.open(
      `https://wa.me/5511999999999?text=${encodeURIComponent(whatsappMessage)}`,
      '_blank'
    )

    setIsSubmitting(false)
    setIsSuccess(true)
    setTimeout(() => setIsSuccess(false), 3000)
  }

  return (
    <section className="py-24 bg-card" id="contact">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Vamos conversar?
              </h2>
              <p className="text-muted-foreground mb-8 text-lg">
                Tem alguma dúvida ou sugestão? Entre em contato e responderemos o mais rápido possível.
              </p>

              <div className="space-y-6">
                <a
                  href="https://wa.me/5511999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 transition-colors"
                >
                  <div className="p-3 rounded-lg bg-green-500/20">
                    <MessageCircle className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <div className="font-semibold">WhatsApp</div>
                    <div className="text-sm text-muted-foreground">
                      Resposta em até 2 horas
                    </div>
                  </div>
                </a>

                <a
                  href="mailto:contato@saraiva.ai"
                  className="flex items-center gap-4 p-4 rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-colors"
                >
                  <div className="p-3 rounded-lg bg-primary/20">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold">E-mail</div>
                    <div className="text-sm text-muted-foreground">
                      contato@saraiva.ai
                    </div>
                  </div>
                </a>
              </div>
            </motion.div>

            {/* Right side - Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-background rounded-2xl border border-border p-6 md:p-8"
            >
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Mensagem enviada!</h3>
                  <p className="text-muted-foreground">
                    Você será redirecionado para o WhatsApp.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Nome
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-muted border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                      placeholder="Seu nome"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      E-mail
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-muted border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                      placeholder="seu@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      Mensagem
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-muted border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                      placeholder="Como podemos ajudar?"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 px-6 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Enviar mensagem
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
