<#
    Genere assets/search-index.js a partir des chapitres de tous les modules.

    Pour chaque <section class="chapter" id="..."> de chaque modules/*.html
    (sauf _template.html), on produit une entree :
        file    nom du fichier du module
        module  contenu de la balise <title> de la page
        anchor  id de la section (= ancre du lien du sommaire)
        title   texte du <h2 class="chapter__title">
        snippet texte brut de toute la section, tronque a 500 caracteres

    A relancer apres toute modification de contenu d'un module.
        pwsh -File tools/generate-search-index.ps1
#>

$ErrorActionPreference = 'Stop'

$root       = Split-Path -Parent $PSScriptRoot
$modulesDir = Join-Path $root 'modules'
$outFile    = Join-Path $root 'assets/search-index.js'

function Convert-ToPlainText {
    param([string]$Html)
    $t = $Html -replace '(?s)<!--.*?-->', ' '
    $t = $t -replace '(?s)<(script|style)\b.*?</\1>', ' '
    $t = $t -replace '<[^>]+>', ' '
    $t = [System.Net.WebUtility]::HtmlDecode($t)
    $t = $t -replace '\s+', ' '
    return $t.Trim()
}

function ConvertTo-JsString {
    param([string]$Value)
    return $Value.Replace('\', '\\').Replace('"', '\"')
}

$entries = New-Object System.Collections.Generic.List[string]

Get-ChildItem -Path $modulesDir -Filter *.html |
    Where-Object { $_.Name -ne '_template.html' } |
    Sort-Object Name |
    ForEach-Object {
        $file = $_.Name
        $html = Get-Content $_.FullName -Raw -Encoding utf8

        $titleMatch = [regex]::Match($html, '(?s)<title>(.*?)</title>')
        $moduleName = if ($titleMatch.Success) { Convert-ToPlainText $titleMatch.Groups[1].Value } else { $file }

        foreach ($section in [regex]::Matches($html, '(?s)<section class="chapter" id="([^"]+)">(.*?)</section>')) {
            $anchor = $section.Groups[1].Value
            $body   = $section.Groups[2].Value

            $h2 = [regex]::Match($body, '(?s)<h2 class="chapter__title">(.*?)</h2>')
            $chapterTitle = if ($h2.Success) { Convert-ToPlainText $h2.Groups[1].Value } else { $anchor }

            $snippet = Convert-ToPlainText $body
            if ($snippet.Length -gt 500) { $snippet = $snippet.Substring(0, 500) }

            $entries.Add(
                '  {file:"'    + (ConvertTo-JsString $file)         +
                '",module:"'   + (ConvertTo-JsString $moduleName)   +
                '",anchor:"'   + (ConvertTo-JsString $anchor)       +
                '",title:"'    + (ConvertTo-JsString $chapterTitle) +
                '",snippet:"'  + (ConvertTo-JsString $snippet)      + '"},'
            )
        }
    }

$out = @()
$out += '// Genere automatiquement - index de recherche full-text du portail'
$out += 'window.SEARCH_INDEX = ['
$out += $entries
$out += '];'

($out -join "`n") + "`n" | Set-Content $outFile -Encoding utf8 -NoNewline

Write-Host "$($entries.Count) chapitres indexes -> assets/search-index.js"
