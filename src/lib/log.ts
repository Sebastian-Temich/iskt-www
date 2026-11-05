/**
 * Logger endpointu formularza (W-06, ADR-001). Zapisuje wyłącznie cztery pola: `event`, `status`,
 * `code` i `requestId`. Inne pola przekazane przez pomyłkę są odrzucane, więc imię, e-mail, treść
 * wiadomości ani IP nie trafią do logów Vercel.
 */

export interface LogEntry {
  event: string;
  status: number;
  code?: string;
  requestId: string;
}

export type LogSink = (line: string) => void;
export type Logger = (entry: LogEntry) => void;

const consoleSink: LogSink = (line) => console.log(line);

export function createLogger(sink: LogSink = consoleSink): Logger {
  return (entry) => {
    const { event, status, code, requestId } = entry;
    sink(
      JSON.stringify(
        code === undefined ? { event, status, requestId } : { event, status, code, requestId },
      ),
    );
  };
}
