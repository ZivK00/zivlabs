const escape = (value) => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[character]);

/** A host-neutral renderer: an Electron preload bridge or web host can mount this safely. */
export function renderWorkspaceShell(mission) {
  const route = mission.route.decision === 'ROUTE' ? `${mission.route.provider} / ${mission.route.surface}` : mission.route.reason;
  return `<main aria-label="ZivLabs workspace">
  <header><h1>ZivLabs</h1><p>Conversation, project grounding, and verified delivery.</p></header>
  <section><h2>Current intent</h2><p>${escape(mission.intent)}</p></section>
  <section><h2>AI resources</h2><p>${escape(route)}</p></section>
  <section><h2>Continuation</h2><p>${escape(mission.handoff.nextAction)}</p></section>
  <section><h2>Verification</h2><p>${escape(mission.verification.verdict)}</p></section>
  <section><h2>Delivery</h2><p>${escape(mission.delivery.state)}</p></section>
</main>`;
}
