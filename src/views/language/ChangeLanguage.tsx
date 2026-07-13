'use client'

import { useState, useMemo } from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import type { PageDefaultProps } from '@/types/pageDefaultTypes'

type Props = { props: PageDefaultProps }

const ChangeLanguage = ({ props }: Props) => {
  const { lang, dictionary: dic } = props
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()


  const languages = useMemo(
    () => [
      { code: 'en', label: dic?.english },
      { code: 'la', label: dic?.lao },

    ],
    [dic]
  )

  const [selected, setSelected] = useState<string>(lang)

  const buildTargetUrl = (newLang: string) => {
    const qs = searchParams?.toString()
    const next = pathname?.replace(/^\/(la|en)(?=\/|$)/, `/${newLang}`)
    return qs ? `${next}?${qs}` : next
  }

  const handleSave = () => {
    if (!selected || selected === lang) return
    const url = buildTargetUrl(selected)
    if (url) {
      router.push(url)
    }
  }

  const handleReset = () => setSelected(lang)

  return (
    <Card>
      <CardHeader
        avatar={<i className="tabler-language text-2xl" />}
        title={dic?.changeLanguage}
        titleTypographyProps={{ marginTop: '5px', fontSize: '18px', fontWeight: 500 }}
      />
      <CardContent>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              {(dic as any)?.selectLanguage}
            </Typography>

            <RadioGroup
              value={selected}
              onChange={e => setSelected(e.target.value)}
              sx={{ display: 'flex', gap: 1 }}
            >
              {languages.map(l => (
                <FormControlLabel
                  key={l.code}
                  value={l.code}
                  control={<Radio />}
                  label={l.label}
                />
              ))}
            </RadioGroup>
          </Grid>

          <Grid item xs={12} sx={{ display: 'flex', gap: 2 }}>
            <Button
              onClick={handleSave}
              variant="contained"
              startIcon={<i className="tabler-check" />}
              disabled={!selected || selected === lang}
            >
              {dic?.saveChange}
            </Button>

            <Button
              onClick={handleReset}
              variant="tonal"
              color="secondary"
              startIcon={<i className="tabler-reload" />}
              disabled={selected === lang}
            >
              {dic?.reset}
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default ChangeLanguage
