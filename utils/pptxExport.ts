// PowerPoint (.pptx) Export Helper for InsightGenie Six Sigma Presentations
// Supports 16:9 widescreen layout with CPF branding, structured cards, KPIs, tables, and formatting

export interface SlideWidget {
  id: string
  title: string
  icon?: string
  type: 'key-value' | 'kpi-grid' | 'process-map' | 'fmea-table' | 'hypothesis' | 'doe-settings' | 'control-plan' | 'stat-cards' | 'text-bullets' | 'free-text'
  data: any
}

export interface PresentationSlide {
  id: number
  title: string
  subtitle: string
  headerTitle?: string
  headerSubtitle?: string
  badge?: string
  date?: string
  footerText?: string
  layout?: '2-col' | '3-col' | '1-col' | 'grid'
  widgets: SlideWidget[]
}

export async function exportPresentationToPptx(
  slides: PresentationSlide[],
  projectName: string = 'InsightGenie Six Sigma Presentation',
  filename: string = 'CPF_SixSigma_Presentation.pptx'
) {
  if (typeof window === 'undefined') return

  const PptxGenJS = (await import('pptxgenjs')).default
  const pptx = new PptxGenJS()

  pptx.layout = 'LAYOUT_16x9'
  pptx.title = projectName
  pptx.author = 'InsightGenie Six Sigma'
  pptx.company = 'CPF Digital Transformation & Quality Excellence'

  // CPF Brand Colors (Hex without #)
  const TEAL_PRIMARY = '008779'
  const TEAL_DARK = '005F55'
  const TEAL_LIGHT_BG = 'F0FDFA'
  const GRAY_BG = 'F8FAFC'
  const BORDER_COLOR = 'CBD5E1'
  const TEXT_MAIN = '0F172A'
  const TEXT_MUTED = '64748B'

  slides.forEach((slideData, index) => {
    const slide = pptx.addSlide()

    // 1. Background
    slide.background = { color: 'FFFFFF' }

    // 2. Header Bar Container
    slide.addShape(pptx.ShapeType.rect, {
      x: 0.5,
      y: 0.4,
      w: 12.33,
      h: 0.7,
      fill: { color: 'FFFFFF' },
      line: { color: 'E2E8F0', width: 0.75 }
    })

    // Logo Icon Box
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.65,
      y: 0.5,
      w: 0.5,
      h: 0.5,
      rectRadius: 0.08,
      fill: { color: TEAL_PRIMARY },
      line: { color: TEAL_DARK, width: 0.5 }
    })
    slide.addText('IG', {
      x: 0.65,
      y: 0.5,
      w: 0.5,
      h: 0.5,
      fontSize: 12,
      bold: true,
      color: 'FFFFFF',
      align: 'center',
      valign: 'middle'
    })

    // Header Title & Subtitle
    slide.addText(
      [
        {
          text: (slideData.headerTitle || 'INSIGHTGENIE SIX SIGMA PRESENTATION') + '\n',
          options: { fontSize: 10, bold: true, color: TEXT_MAIN }
        },
        {
          text: slideData.headerSubtitle || 'CPF Digital Transformation & Quality Excellence',
          options: { fontSize: 8, color: TEXT_MUTED }
        }
      ],
      {
        x: 1.25,
        y: 0.45,
        w: 6.5,
        h: 0.6,
        valign: 'middle'
      }
    )

    // Header Badge & Date (Right Side)
    const badgeText = slideData.badge || 'Black Belt Certified Project'
    const dateText = slideData.date || 'Feb 2026'

    slide.addShape(pptx.ShapeType.roundRect, {
      x: 9.6,
      y: 0.55,
      w: 2.0,
      h: 0.38,
      rectRadius: 0.06,
      fill: { color: TEAL_LIGHT_BG },
      line: { color: '99F6E4', width: 0.75 }
    })
    slide.addText(badgeText, {
      x: 9.6,
      y: 0.55,
      w: 2.0,
      h: 0.38,
      fontSize: 8,
      bold: true,
      color: TEAL_PRIMARY,
      align: 'center',
      valign: 'middle'
    })

    slide.addText(`Date: ${dateText}`, {
      x: 11.7,
      y: 0.55,
      w: 1.0,
      h: 0.38,
      fontSize: 8,
      color: TEXT_MUTED,
      align: 'right',
      valign: 'middle'
    })

    // 3. Slide Title & Subtitle Area
    slide.addText(
      [
        {
          text: `${slideData.title}\n`,
          options: { fontSize: 15, bold: true, color: TEXT_MAIN }
        },
        {
          text: slideData.subtitle,
          options: { fontSize: 9.5, color: TEXT_MUTED }
        }
      ],
      {
        x: 0.5,
        y: 1.25,
        w: 12.33,
        h: 0.8,
        valign: 'top'
      }
    )

    // 4. Render Content Cards
    const widgets = slideData.widgets || []
    const count = widgets.length

    if (count === 1 && widgets[0]) {
      renderWidget(pptx, slide, widgets[0], 0.5, 2.1, 12.33, 4.4)
    } else if (count === 2 && widgets[0] && widgets[1]) {
      renderWidget(pptx, slide, widgets[0], 0.5, 2.1, 6.0, 4.4)
      renderWidget(pptx, slide, widgets[1], 6.83, 2.1, 6.0, 4.4)
    } else if (count === 3 && widgets[0] && widgets[1] && widgets[2]) {
      renderWidget(pptx, slide, widgets[0], 0.5, 2.1, 3.9, 4.4)
      renderWidget(pptx, slide, widgets[1], 4.7, 2.1, 3.9, 4.4)
      renderWidget(pptx, slide, widgets[2], 8.9, 2.1, 3.9, 4.4)
    } else if (count >= 4 && widgets[0] && widgets[1] && widgets[2] && widgets[3]) {
      renderWidget(pptx, slide, widgets[0], 0.5, 2.1, 6.0, 2.1)
      renderWidget(pptx, slide, widgets[1], 6.83, 2.1, 6.0, 2.1)
      renderWidget(pptx, slide, widgets[2], 0.5, 4.4, 6.0, 2.1)
      renderWidget(pptx, slide, widgets[3], 6.83, 4.4, 6.0, 2.1)
    }

    // 5. Footer Area
    slide.addShape(pptx.ShapeType.line, {
      x: 0.5,
      y: 6.75,
      w: 12.33,
      h: 0,
      line: { color: 'E2E8F0', width: 0.5 }
    })

    const footerNotice = slideData.footerText || 'Confidential — Internal CPF Six Sigma Documentation'
    slide.addText(footerNotice, {
      x: 0.5,
      y: 6.8,
      w: 8.0,
      h: 0.35,
      fontSize: 8,
      color: TEXT_MUTED,
      valign: 'middle'
    })

    slide.addText(`Slide ${index + 1} of ${slides.length}`, {
      x: 10.0,
      y: 6.8,
      w: 2.83,
      h: 0.35,
      fontSize: 8,
      bold: true,
      color: TEXT_MUTED,
      align: 'right',
      valign: 'middle'
    })
  })

  // Trigger browser download
  await pptx.writeFile({ fileName: filename })
}

// Render individual widget into PPTX slide canvas
function renderWidget(
  pptx: any,
  slide: any,
  widget: SlideWidget,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const TEAL_PRIMARY = '008779'
  const GRAY_BG = 'F8FAFC'
  const BORDER_COLOR = 'CBD5E1'
  const TEXT_MAIN = '0F172A'
  const TEXT_MUTED = '475569'

  // Outer Card Box
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w,
    h,
    rectRadius: 0.1,
    fill: { color: GRAY_BG },
    line: { color: BORDER_COLOR, width: 0.75 }
  })

  // Card Header Title
  slide.addText(widget.title || 'Section', {
    x: x + 0.25,
    y: y + 0.2,
    w: w - 0.5,
    h: 0.4,
    fontSize: 11,
    bold: true,
    color: TEAL_PRIMARY,
    valign: 'top'
  })

  const contentY = y + 0.65
  const contentH = h - 0.8
  const contentW = w - 0.5
  const contentX = x + 0.25

  switch (widget.type) {
    case 'key-value': {
      const items: Array<{ label: string; value: string; isHighlight?: boolean }> = widget.data?.items || []
      const textRows: any[] = []

      items.forEach((item) => {
        if (item.isHighlight) {
          slide.addShape(pptx.ShapeType.roundRect, {
            x: contentX,
            y: contentY + textRows.length * 0.45,
            w: contentW,
            h: 0.6,
            rectRadius: 0.05,
            fill: { color: 'F0FDFA' },
            line: { color: '99F6E4', width: 0.75 }
          })
          slide.addText(
            [
              { text: `${item.label}: `, options: { bold: true, color: '134E4A', fontSize: 9.5 } },
              { text: item.value, options: { bold: true, color: TEAL_PRIMARY, fontSize: 10.5 } }
            ],
            {
              x: contentX + 0.15,
              y: contentY + textRows.length * 0.45,
              w: contentW - 0.3,
              h: 0.6,
              valign: 'middle'
            }
          )
        } else {
          textRows.push(
            { text: `${item.label}:\n`, options: { fontSize: 8.5, bold: true, color: '334155' } },
            { text: `${item.value}\n\n`, options: { fontSize: 9.5, color: TEXT_MAIN } }
          )
        }
      })

      if (textRows.length > 0) {
        slide.addText(textRows, {
          x: contentX,
          y: contentY,
          w: contentW,
          h: contentH - 0.7,
          valign: 'top'
        })
      }
      break
    }

    case 'kpi-grid': {
      const kpis: Array<{ label: string; value: string; color?: string; desc?: string }> = widget.data?.kpis || []
      const rule = widget.data?.rule || ''
      const numKpis = Math.max(kpis.length, 1)
      const kpiW = (contentW - (numKpis - 1) * 0.15) / numKpis

      kpis.forEach((kpi, i) => {
        const kX = contentX + i * (kpiW + 0.15)
        const kColor = kpi.color === 'red' ? 'DC2626' : kpi.color === 'amber' ? 'D97706' : '7C3AED'
        const kBg = kpi.color === 'red' ? 'FEF2F2' : kpi.color === 'amber' ? 'FFFBEB' : 'F5F3FF'
        const kBorder = kpi.color === 'red' ? 'FECACA' : kpi.color === 'amber' ? 'FDE68A' : 'DDD6FE'

        slide.addShape(pptx.ShapeType.roundRect, {
          x: kX,
          y: contentY,
          w: kpiW,
          h: 1.3,
          rectRadius: 0.06,
          fill: { color: kBg },
          line: { color: kBorder, width: 0.75 }
        })

        slide.addText(
          [
            { text: `${kpi.label}\n`, options: { fontSize: 8, bold: true, color: kColor } },
            { text: `${kpi.value}\n`, options: { fontSize: 16, bold: true, color: kColor } },
            ...(kpi.desc ? [{ text: kpi.desc, options: { fontSize: 7, color: TEXT_MUTED } }] : [])
          ],
          {
            x: kX,
            y: contentY,
            w: kpiW,
            h: 1.3,
            align: 'center',
            valign: 'middle'
          }
        )
      })

      if (rule) {
        slide.addShape(pptx.ShapeType.roundRect, {
          x: contentX,
          y: contentY + 1.5,
          w: contentW,
          h: 0.8,
          rectRadius: 0.05,
          fill: { color: 'FFFFFF' },
          line: { color: BORDER_COLOR, width: 0.5 }
        })
        slide.addText(
          [
            { text: 'Goal Formulation Rule: ', options: { bold: true, fontSize: 8.5, color: TEXT_MAIN } },
            { text: rule, options: { fontSize: 8.5, color: TEXT_MUTED } }
          ],
          {
            x: contentX + 0.15,
            y: contentY + 1.5,
            w: contentW - 0.3,
            h: 0.8,
            valign: 'middle'
          }
        )
      }
      break
    }

    case 'fmea-table': {
      const desc = widget.data?.description || ''
      const rows = widget.data?.rows || []

      if (desc) {
        slide.addText(desc, {
          x: contentX,
          y: contentY,
          w: contentW,
          h: 0.5,
          fontSize: 8.5,
          color: TEXT_MUTED,
          valign: 'top'
        })
      }

      const tableData: any[][] = [
        [
          { text: 'Rank', options: { bold: true, fill: 'F1F5F9', fontSize: 8, align: 'center' } },
          { text: 'Potential Root Cause', options: { bold: true, fill: 'F1F5F9', fontSize: 8 } },
          { text: 'S', options: { bold: true, fill: 'F1F5F9', fontSize: 8, align: 'center' } },
          { text: 'O', options: { bold: true, fill: 'F1F5F9', fontSize: 8, align: 'center' } },
          { text: 'D', options: { bold: true, fill: 'F1F5F9', fontSize: 8, align: 'center' } },
          { text: 'RPN', options: { bold: true, fill: 'F1F5F9', fontSize: 8, align: 'center', color: 'DC2626' } }
        ]
      ]

      rows.forEach((r: any) => {
        tableData.push([
          { text: r.rank || '#1', options: { fontSize: 8, bold: true, align: 'center' } },
          { text: r.cause || '', options: { fontSize: 8 } },
          { text: String(r.s || 0), options: { fontSize: 8, align: 'center' } },
          { text: String(r.o || 0), options: { fontSize: 8, align: 'center' } },
          { text: String(r.d || 0), options: { fontSize: 8, align: 'center' } },
          { text: String(r.rpn || 0), options: { fontSize: 8.5, bold: true, align: 'center', color: 'DC2626' } }
        ])
      })

      slide.addTable(tableData, {
        x: contentX,
        y: contentY + (desc ? 0.55 : 0),
        w: contentW,
        colW: [0.6, 2.8, 0.4, 0.4, 0.4, 0.7],
        fill: 'FFFFFF',
        border: { type: 'solid', color: BORDER_COLOR, pt: 0.5 }
      })
      break
    }

    case 'stat-cards': {
      const stats: Array<{ label: string; value: string; color?: string }> = widget.data?.stats || []
      const note = widget.data?.note || ''
      const numStats = Math.max(stats.length, 1)
      const statW = (contentW - (numStats - 1) * 0.2) / numStats

      stats.forEach((st, i) => {
        const sX = contentX + i * (statW + 0.2)
        const isSavings = st.label.toLowerCase().includes('savings') || st.label.includes('ประหยัด')
        const colorHex = isSavings ? TEAL_PRIMARY : '059669'
        const bgHex = isSavings ? 'F0FDFA' : 'ECFDF5'
        const borderHex = isSavings ? '99F6E4' : 'A7F3D0'

        slide.addShape(pptx.ShapeType.roundRect, {
          x: sX,
          y: contentY,
          w: statW,
          h: 1.5,
          rectRadius: 0.08,
          fill: { color: bgHex },
          line: { color: borderHex, width: 0.75 }
        })

        slide.addText(
          [
            { text: `${st.label}\n`, options: { fontSize: 8.5, bold: true, color: colorHex } },
            { text: `${st.value}`, options: { fontSize: 18, bold: true, color: colorHex } }
          ],
          {
            x: sX,
            y: contentY,
            w: statW,
            h: 1.5,
            align: 'center',
            valign: 'middle'
          }
        )
      })

      if (note) {
        slide.addText(note, {
          x: contentX,
          y: contentY + 1.7,
          w: contentW,
          h: 0.5,
          fontSize: 9,
          bold: true,
          color: '334155',
          align: 'center',
          valign: 'middle'
        })
      }
      break
    }

    case 'hypothesis': {
      const desc = widget.data?.description || ''
      const pVal = widget.data?.pValueText || ''
      const conclusion = widget.data?.conclusion || ''

      slide.addText(
        [
          ...(desc ? [{ text: `${desc}\n\n`, options: { fontSize: 9, color: TEXT_MUTED } }] : []),
          ...(pVal ? [{ text: `${pVal}\n\n`, options: { fontSize: 9.5, bold: true, color: TEXT_MAIN } }] : [])
        ],
        {
          x: contentX,
          y: contentY,
          w: contentW,
          h: 1.6,
          valign: 'top'
        }
      )

      if (conclusion) {
        slide.addShape(pptx.ShapeType.roundRect, {
          x: contentX,
          y: contentY + 1.8,
          w: contentW,
          h: 0.8,
          rectRadius: 0.06,
          fill: { color: 'ECFDF5' },
          line: { color: 'A7F3D0', width: 0.75 }
        })
        slide.addText(conclusion, {
          x: contentX + 0.15,
          y: contentY + 1.8,
          w: contentW - 0.3,
          h: 0.8,
          fontSize: 9,
          bold: true,
          color: '065F46',
          valign: 'middle'
        })
      }
      break
    }

    case 'doe-settings': {
      const desc = widget.data?.description || ''
      const formula = widget.data?.formula || ''

      if (desc) {
        slide.addText(desc, {
          x: contentX,
          y: contentY,
          w: contentW,
          h: 0.8,
          fontSize: 9,
          color: TEXT_MUTED,
          valign: 'top'
        })
      }

      if (formula) {
        slide.addShape(pptx.ShapeType.roundRect, {
          x: contentX,
          y: contentY + 0.9,
          w: contentW,
          h: 0.9,
          rectRadius: 0.06,
          fill: { color: 'F0FDFA' },
          line: { color: '99F6E4', width: 0.75 }
        })
        slide.addText(formula, {
          x: contentX + 0.15,
          y: contentY + 0.9,
          w: contentW - 0.3,
          h: 0.9,
          fontSize: 9.5,
          bold: true,
          color: '134E4A',
          valign: 'middle'
        })
      }
      break
    }

    case 'text-bullets':
    case 'control-plan':
    default: {
      const desc = widget.data?.description || ''
      const bullets: string[] = widget.data?.bullets || widget.data?.items || []

      const textArr: any[] = []
      if (desc) {
        textArr.push({ text: `${desc}\n\n`, options: { fontSize: 9, color: TEXT_MUTED } })
      }

      bullets.forEach((b: any) => {
        const str = typeof b === 'string' ? b : b.title || b.text || ''
        textArr.push({
          text: `• ${str}\n`,
          options: { fontSize: 9, color: TEXT_MAIN, bold: false }
        })
      })

      slide.addText(textArr, {
        x: contentX,
        y: contentY,
        w: contentW,
        h: contentH,
        valign: 'top'
      })
      break
    }
  }
}
