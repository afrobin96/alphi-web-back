/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { marked } from 'marked';
import puppeteer from 'puppeteer';
import { CreateInstructionalDto } from 'src/instructional-designer/dto/create-instructional.dto';

@Injectable()
export class PdfService {
  async generatePdf(
    markdownContent: string,
    dto: CreateInstructionalDto,
  ): Promise<Buffer> {
    const htmlContent = await marked(markdownContent);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const html = this.buildHtmlTemplate(htmlContent, dto);

    let browser;
    try {
      browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: true,
      });

      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });

      const pdf = await page.pdf({
        format: 'A4',
        margin: { top: '20mm', right: '18mm', bottom: '20mm', left: '18mm' },
        printBackground: true,
      });

      return Buffer.from(pdf);
    } catch (error) {
      throw new InternalServerErrorException('Error generando el PDF.' + error);
    } finally {
      if (browser) await browser.close();
    }
  }

  private buildHtmlTemplate(
    htmlContent: string,
    dto: CreateInstructionalDto,
  ): string {
    return `
        <!DOCTYPE html>
        <html lang="es">
        <head>
        <meta charset="UTF-8">
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

            * { box-sizing: border-box; margin: 0; padding: 0; }

            body {
            font-family: 'Inter', sans-serif;
            font-size: 13px;
            color: #1a1a2e;
            line-height: 1.7;
            }

            /* Portada */
            .cover {
            background: linear-gradient(135deg, #4a4a8a 0%, #6a5acd 100%);
            color: white;
            padding: 60px 48px;
            min-height: 200px;
            border-radius: 0 0 24px 24px;
            margin-bottom: 40px;
            }
            .cover h1 {
            font-size: 26px;
            font-weight: 700;
            margin-bottom: 16px;
            line-height: 1.3;
            }
            .badges { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 20px; }
            .badge {
            background: rgba(255,255,255,0.2);
            border: 1px solid rgba(255,255,255,0.35);
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 500;
            }

            /* Contenido */
            .content { padding: 0 8px; }

            h1 { display: none; } /* Ya está en la portada */
            h2 {
            font-size: 17px;
            font-weight: 700;
            color: #4a4a8a;
            border-bottom: 2px solid #e8e6ff;
            padding-bottom: 8px;
            margin: 36px 0 16px;
            }
            h3 {
            font-size: 14px;
            font-weight: 600;
            color: #6a5acd;
            margin: 24px 0 10px;
            }
            h4 {
            font-size: 13px;
            font-weight: 600;
            color: #1a1a2e;
            margin: 16px 0 8px;
            }

            p { margin-bottom: 12px; }

            ul, ol {
            padding-left: 20px;
            margin-bottom: 12px;
            }
            li { margin-bottom: 4px; }

            /* Tarjetas de actividades */
            li strong:first-child {
            color: #4a4a8a;
            }

            /* Módulos */
            h3:has(+ p) {
            background: #f8f7ff;
            padding: 10px 14px;
            border-left: 4px solid #6a5acd;
            border-radius: 0 8px 8px 0;
            }

            /* Rúbrica y tablas */
            table {
            width: 100%;
            border-collapse: collapse;
            margin: 16px 0;
            font-size: 12px;
            }
            th {
            background: #4a4a8a;
            color: white;
            padding: 8px 12px;
            text-align: left;
            font-weight: 600;
            }
            td {
            padding: 8px 12px;
            border-bottom: 1px solid #e8e6ff;
            }
            tr:nth-child(even) td { background: #f8f7ff; }

            /* Separador */
            hr {
            border: none;
            border-top: 1px solid #e8e6ff;
            margin: 32px 0;
            }

            /* Footer */
            .footer {
            margin-top: 48px;
            padding-top: 16px;
            border-top: 1px solid #e8e6ff;
            font-size: 11px;
            color: #9090a0;
            text-align: center;
            }

            /* Salto de página antes de secciones principales */
            h2 { page-break-before: auto; }
            h2:first-of-type { page-break-before: avoid; }
        </style>
        </head>
        <body>
        <div class="cover">
            <h1>${dto.topic}</h1>
            <p style="opacity:0.85;font-size:13px;">Diseño instruccional generado por IA</p>
            <div class="badges">
            <span class="badge">${dto.knowledgeArea}</span>
            <span class="badge">${dto.educationLevel}</span>
            <span class="badge">${dto.targetAudience}</span>
            </div>
        </div>

        <div class="content">
            ${htmlContent}
        </div>

        <div class="footer">
            Generado el ${new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
            · AlphiWeb — Diseño Instruccional IA
        </div>
        </body>
        </html>
    `;
  }
}
