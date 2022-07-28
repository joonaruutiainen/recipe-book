import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Stack,
  Grid,
  Divider,
  Button,
  Typography,
  Card,
  CardMedia,
  Box,
  CircularProgress,
  TextField,
  MenuItem,
  Switch,
  Fab,
  Tooltip,
  IconButton,
  FormGroup,
  FormControlLabel,
} from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import AddIcon from '@mui/icons-material/Add';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { recipeActions } from '../redux/slices/recipesSlice';
import { TagButton, TagEditor, IngredientEditor } from '../components';
import { RecipeDuration, RecipeIngredient, RecipeStep, RecipeSubtitle, RecipeTag } from '../types';

const RecipeEditor = () => {
  const { user } = useAppSelector(state => state.auth);
  const {
    selected: recipe,
    recipeEditorData,
    newRecipe,
    loadingOne: loading,
    error,
  } = useAppSelector(state => state.recipes);

  const [image, setImage] = useState<File | undefined>(undefined);

  const [title, setTitle] = useState<string>(recipe?.title || '');
  const [missingTitle, setMissingTitle] = useState(false);

  const [description, setDescription] = useState<string>(recipe?.description || '');
  const [missingDescription, setMissingDescription] = useState(false);

  const [duration, setDuration] = useState<RecipeDuration>(recipe?.duration || { hours: 0, minutes: 0 });
  const [invalidDuration, setInvalidDuration] = useState(false);

  const [tags, setTags] = useState<RecipeTag[]>(recipe?.tags || []);
  const [anchorElTags, setAnchorElTags] = useState<null | HTMLDivElement>(null);
  const tagGrid = useRef<HTMLDivElement>(null);

  const [useSubtitles, setUseSubtitles] = useState(Boolean(recipe?.subtitles) || false);
  const [subtitle, setSubtitle] = useState<RecipeSubtitle | null>(null);
  const [invalidSubtitle, setInvalidSubtitle] = useState(false);
  const [subtitles, setSubtitles] = useState<RecipeSubtitle[]>(recipe?.subtitles || []);

  const [portionSize, setPortionSize] = useState<number>(recipe?.portionSize || 1);
  const [portionSizeUnit, setPortionSizeUnit] = useState<string>('annosta');

  const [ingredient, setIngredient] = useState<RecipeIngredient | null>(null);
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>(recipe?.ingredients || []);
  const [invalidIngredients, setInvalidIngredients] = useState(false);

  const [instructionStep, setInstructionStep] = useState<RecipeStep | null>(null);
  const [instructions, setInstructions] = useState<RecipeStep[]>(recipe?.instructions || []);
  const [missingInstructionStepTitle, setMissingInstructionStepTitle] = useState(false);
  const [missingInstructionStepDescription, setMissingInstructionStepDescription] = useState(false);
  const [invalidInstructions, setInvalidInstructions] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (recipeEditorData) {
      setTitle(recipeEditorData.title);
      setDescription(recipeEditorData.description);
      setDuration(recipeEditorData.duration);
      setTags(recipeEditorData.tags || []);
      setSubtitles(recipeEditorData.subtitles || []);
      setPortionSize(recipeEditorData.portionSize);
      setIngredients(recipeEditorData.ingredients);
      setInstructions(recipeEditorData.instructions);
    }
  }, [dispatch, recipeEditorData]);

  useEffect(() => {
    if (useSubtitles && subtitles.length === 0) setUseSubtitles(false);
  }, [useSubtitles, subtitles]);

  const submit = () => {
    if (!title) setMissingTitle(true);
    if (!description) setMissingDescription(true);
    if (!(duration.minutes > 0) && !(duration.hours > 0)) setInvalidDuration(true);
    if (!(ingredients.length > 0)) setInvalidIngredients(true);
    if (!(instructions.length > 0)) setInvalidInstructions(true);
    if (
      user &&
      title &&
      description &&
      (duration.minutes > 0 || duration.hours > 0) &&
      ingredients.length > 0 &&
      instructions.length > 0
    ) {
      const recipeData = {
        image,
        title,
        description,
        duration,
        tags: tags.length > 0 ? tags : undefined,
        portionSize,
        subtitles: useSubtitles && subtitles.length > 0 ? subtitles : [],
        ingredients: !useSubtitles ? ingredients.map(i => ({ ...i, subtitle: undefined })) : ingredients,
        instructions,
        pages: 1,
        user: {
          id: user.id,
          name: user.name,
        },
      };
      dispatch(
        recipe ? recipeActions.updateRecipe({ id: recipe.id, ...recipeData }) : recipeActions.addRecipe(recipeData)
      );
    }
  };

  const toggleSubtitles = () => {
    if (subtitles.length === 0) {
      const newSubtitle: RecipeSubtitle = { name: 'Alaotsikko 1', index: 1 };
      setSubtitles([newSubtitle]);
      setSubtitle(newSubtitle);
      setIngredients(ingredients.map(ingr => ({ ...ingr, subtitle: newSubtitle })));
    } else if (ingredients.length > 0) setIngredients(ingredients.filter(ingr => ingr.subtitle !== undefined));
    if (subtitle) setSubtitle(null);
    if (ingredient) setIngredient(null);
    setUseSubtitles(!useSubtitles);
  };

  const removeSubtitle = () => {
    if (subtitle && subtitles.find(st => st.index === subtitle.index)) {
      setSubtitles(subtitles.filter(st => st.index !== subtitle.index).map((st, i) => ({ ...st, index: i + 1 })));
      setIngredients(
        ingredients
          .filter(ingr => ingr.subtitle?.index !== subtitle.index)
          .map(ingr =>
            ingr.subtitle && ingr.subtitle.index > subtitle.index
              ? { ...ingr, subtitle: { ...ingr.subtitle, index: ingr.subtitle.index - 1 } }
              : ingr
          )
      );
    }
    if (invalidSubtitle) setInvalidSubtitle(false);
    setSubtitle(null);
  };

  const addSubtitle = () => {
    if (!subtitle?.name) setInvalidSubtitle(true);
    if (subtitle && subtitle.name) {
      if (subtitles.find(st => st.index === subtitle.index))
        setSubtitles(subtitles.map(st => (st.index === subtitle.index ? subtitle : st)));
      else setSubtitles(subtitles.concat([subtitle]).sort((a, b) => a.index - b.index));
      setSubtitle(null);
    }
  };

  const addIngredient = (ingr: RecipeIngredient) => {
    setIngredients(ingredients.concat([ingr]));
    setIngredient(null);
  };

  const removeIngredient = () => {
    if (ingredient && ingredients.includes(ingredient)) setIngredients(ingredients.filter(i => i !== ingredient));
    setIngredient(null);
  };

  const addInstructionStep = () => {
    if (!instructionStep?.title) setMissingInstructionStepTitle(true);
    if (!instructionStep?.description) setMissingInstructionStepDescription(true);
    if (instructionStep && instructionStep.title && instructionStep.description) {
      if (instructions.find(step => step.index === instructionStep.index))
        setInstructions(instructions.map(step => (step.index === instructionStep.index ? instructionStep : step)));
      else setInstructions(instructions.concat([instructionStep]).sort((a, b) => a.index - b.index));
      setInstructionStep(null);
    }
  };

  const removeInstructionStep = () => {
    if (instructionStep && instructions.includes(instructionStep))
      setInstructions(instructions.filter(i => i !== instructionStep).map((step, i) => ({ ...step, index: i + 1 })));
    if (missingInstructionStepTitle) setMissingInstructionStepTitle(false);
    if (missingInstructionStepDescription) setMissingInstructionStepDescription(false);
    setInstructionStep(null);
  };

  const imageFileUpload = (
    <Card
      sx={{
        width: '100%',
        height: !image && !recipe?.image ? '100px' : 'fit-content',
        maxHeight: '400px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: '7px',
        backgroundColor: 'white',
        boxShadow: '2px 2px 5px 2px rgba(57, 53, 44, 0.4)',
      }}
    >
      {recipe?.image && !image && (
        <CardMedia
          component='img'
          image={`http://localhost:8080/api/v1/recipes/${recipe.id}/image`}
          crossOrigin='use-credentials'
          sx={{ maxHeight: '75%' }}
        />
      )}
      {image && <CardMedia component='img' image={URL.createObjectURL(image)} sx={{ maxHeight: '75%' }} />}
      <Stack direction='row' justifyContent='center' alignItems='center' height='100px' spacing={2}>
        <input
          id='image-file-upload'
          type='file'
          accept='image/*'
          style={{ display: 'none' }}
          onChange={e => setImage(e.target.files?.[0])}
        />
        <label htmlFor='image-file-upload' style={{ width: 'max-content' }}>
          <Fab component='span'>
            <AddPhotoAlternateIcon color='primary' />
          </Fab>
        </label>
        <Typography variant='body1'>{image ? image.name : 'Lataa kuva reseptistä'}</Typography>
        {image && (
          <Tooltip title='Poista kuva'>
            <IconButton onClick={() => setImage(undefined)} sx={{ p: '1px' }}>
              <CloseIcon
                color='primary'
                sx={{
                  '&:hover': {
                    cursor: 'pointer',
                  },
                }}
              />
            </IconButton>
          </Tooltip>
        )}
      </Stack>
    </Card>
  );

  const titleEditor = (
    <Stack direction='column' width='100%'>
      <TextField
        label='Reseptin otsikko'
        value={title}
        fullWidth
        error={missingTitle}
        inputProps={{ maxLength: 100 }}
        onChange={e => {
          if (missingTitle) setMissingTitle(false);
          setTitle(e.target.value);
        }}
      />
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
        <Typography variant='subtitle1'>{title.length}/100</Typography>
      </Box>
    </Stack>
  );

  const descriptionEditor = (
    <Stack direction='column' width='100%'>
      <TextField
        label='Reseptin kuvaus'
        value={description}
        fullWidth
        error={missingDescription}
        multiline
        rows={4}
        inputProps={{ maxLength: 1000 }}
        onChange={e => {
          if (missingDescription) setMissingDescription(false);
          setDescription(e.target.value);
        }}
      />
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
        <Typography variant='subtitle1'>{description.length}/1000</Typography>
      </Box>
    </Stack>
  );

  const durationEditor = (
    <Stack direction='column' width='100%' spacing={2}>
      <Typography variant='h4'>Valmistusaika</Typography>
      <Stack direction='row' spacing={1} alignItems='center'>
        <TextField
          select
          label='h'
          value={duration.hours}
          size='small'
          error={invalidDuration}
          SelectProps={{
            MenuProps: {
              PaperProps: {
                style: { maxHeight: 200 },
              },
            },
          }}
          sx={{ width: '100px' }}
          onChange={e => {
            if (invalidDuration) setInvalidDuration(false);
            setDuration({ ...duration, hours: parseInt(e.target.value, 10) });
          }}
        >
          {[...Array(100).keys()].map(i => (
            <MenuItem key={i} value={i}>
              {i}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label='min'
          value={duration.minutes}
          size='small'
          error={invalidDuration}
          SelectProps={{
            MenuProps: {
              PaperProps: {
                style: { maxHeight: 200 },
              },
            },
          }}
          sx={{ width: '100px' }}
          onChange={e => {
            if (invalidDuration) setInvalidDuration(false);
            setDuration({ ...duration, minutes: parseInt(e.target.value, 10) });
          }}
        >
          {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map(i => (
            <MenuItem key={i} value={i}>
              {i}
            </MenuItem>
          ))}
        </TextField>
        {invalidDuration && (
          <Typography variant='body1' color='error'>
            {'< 5 min'}
          </Typography>
        )}
      </Stack>
    </Stack>
  );

  const tagEditor = (
    <Stack direction='column' width='100%' spacing={1}>
      <Typography variant='h4'>Tunnisteet</Typography>
      <Grid container spacing={1} ref={tagGrid}>
        {tags.map(tag => (
          <Grid key={tag.name} item>
            <TagButton text={tag.name} color={tag.color} />
          </Grid>
        ))}
        <Grid item>
          <TagButton text='muokkaa tunnisteita' onClick={() => setAnchorElTags(tagGrid.current)} />
        </Grid>
        <TagEditor
          anchorEl={anchorElTags}
          open={Boolean(anchorElTags)}
          selection={tags}
          onClose={() => {
            setAnchorElTags(null);
          }}
          onSave={(tagSelection: RecipeTag[]) => {
            setTags(tagSelection);
            setAnchorElTags(null);
          }}
        />
      </Grid>
    </Stack>
  );

  const newSubtitleButton = (
    <Button
      startIcon={<AddIcon color='primary' />}
      onClick={() => {
        const newSubtitle: RecipeSubtitle = { name: `Alaotsikko ${subtitles.length + 1}`, index: subtitles.length + 1 };
        if (ingredient) setIngredient(null);
        setSubtitle(newSubtitle);
        setSubtitles(subtitles.concat([newSubtitle]));
      }}
      sx={{
        fontSize: 24,
        fontFamily: 'Segoe UI',
        fontWeight: 'lighter',
      }}
    >
      Lisää uusi alaotsikko
    </Button>
  );

  const newIngredientButton = (st?: RecipeSubtitle) => (
    <Button
      startIcon={<AddIcon color='primary' />}
      onClick={() => {
        if (invalidIngredients) setInvalidIngredients(false);
        if (subtitle) setSubtitle(null);
        const newIngredient: RecipeIngredient = { quantity: 1, unit: 'kpl', description: '', subtitle: st };
        setIngredient(newIngredient);
      }}
      sx={{
        fontSize: useSubtitles ? 20 : 24,
        fontFamily: 'Segoe UI',
        fontWeight: 'lighter',
      }}
    >
      Lisää ainesosa
    </Button>
  );

  const singleIngredient = (index: number, ingr: RecipeIngredient) => (
    <Stack key={index} direction='row' justifyContent='flex-end' alignItems='center'>
      <Box sx={{ width: '20%' }}>
        {ingr.quantity && ingr.unit && (
          <Typography variant='body1'>
            {ingr.quantity} {ingr.unit}
          </Typography>
        )}
      </Box>
      <Box sx={{ width: 'fit-content', minWidth: '45%' }}>
        <Typography variant='body1'>{ingr.description}</Typography>
      </Box>
      <Button
        endIcon={<EditIcon color='primary' />}
        onClick={() => {
          if (subtitle) setSubtitle(null);
          setIngredients(ingredients.filter(i => i !== ingr));
          setIngredient(ingr);
        }}
        sx={{ fontSize: 18 }}
      >
        Muokkaa
      </Button>
    </Stack>
  );

  const ingredientsEditor = (
    <Stack direction='column' width='100%' spacing={2}>
      <Typography variant='h4'>Ainesosat</Typography>
      <Stack direction='row' spacing={2} justifyContent='space-between'>
        <Stack direction='row' spacing={1} alignItems='center'>
          <FormGroup>
            <FormControlLabel
              control={<Switch color='secondary' checked={useSubtitles} onClick={toggleSubtitles} />}
              label='Jaa alaotsikoihin'
            />
          </FormGroup>
        </Stack>
        <Stack direction='row' spacing={1} alignItems='center'>
          <Typography variant='body1'>Annoskoko</Typography>
          <TextField
            type='number'
            hiddenLabel
            size='small'
            value={portionSize}
            onChange={e => setPortionSize(parseInt(e.target.value, 10))}
            inputProps={{
              min: 1,
              max: 100,
            }}
            sx={{ width: '80px' }}
          />
          <TextField
            select
            hiddenLabel
            size='small'
            value={portionSizeUnit}
            onChange={e => setPortionSizeUnit(e.target.value)}
            SelectProps={{
              MenuProps: {
                PaperProps: {
                  style: { maxHeight: 200 },
                },
              },
            }}
            sx={{ width: '120px' }}
          >
            <MenuItem value='annosta'>annosta</MenuItem>
            <MenuItem value='cm &#216;'>cm &#216;</MenuItem>
          </TextField>
        </Stack>
      </Stack>
      <Stack direction='column' spacing={2} divider={<Divider orientation='horizontal' flexItem />}>
        {invalidIngredients && (
          <Typography variant='body1' color='error'>
            Lisää vähintään 1 ainesosa
          </Typography>
        )}
        {useSubtitles && (
          <Stack direction='column' divider={<Divider orientation='horizontal' flexItem />} spacing={2}>
            {subtitles.map(st => (
              <Stack key={st.index} direction='column' width='100%' spacing={1}>
                {subtitle && subtitle.index === st.index && (
                  <Stack direction='row' justifyContent='space-between' alignItems='center' spacing={2}>
                    <TextField
                      label={`Alaotsikko ${st.index}`}
                      size='small'
                      error={invalidSubtitle}
                      value={subtitle.name}
                      onChange={e => {
                        if (invalidSubtitle) setInvalidSubtitle(false);
                        setSubtitle({ ...st, name: e.target.value });
                      }}
                    />
                    <Button
                      endIcon={<CloseIcon color='primary' />}
                      onClick={() => removeSubtitle()}
                      sx={{ fontSize: 18 }}
                    >
                      Poista alaotsikko
                    </Button>
                    <Button endIcon={<DoneIcon color='primary' />} onClick={() => addSubtitle()} sx={{ fontSize: 18 }}>
                      Tallenna
                    </Button>
                  </Stack>
                )}
                {!(subtitle && subtitle.index === st.index) && (
                  <Stack direction='row' alignItems='center' spacing={2}>
                    <Typography variant='body1'>{st.name}</Typography>
                    <Button
                      endIcon={<EditIcon color='primary' />}
                      onClick={() => {
                        if (ingredient) setIngredient(null);
                        setSubtitle(st);
                      }}
                      sx={{ fontSize: 18 }}
                    >
                      Muokkaa
                    </Button>
                  </Stack>
                )}
                {ingredients
                  .filter(ingr => ingr.subtitle?.index === st.index)
                  .map((ingr, index) => singleIngredient(index, ingr))}
                <Stack direction='row' justifyContent='flex-end' alignItems='center' spacing={2}>
                  {!ingredient && newIngredientButton(st)}
                  {ingredient && ingredient.subtitle?.index === st.index && (
                    <IngredientEditor
                      ingredient={ingredient}
                      subtitle={ingredient.subtitle}
                      onClose={removeIngredient}
                      onSave={addIngredient}
                    />
                  )}
                </Stack>
              </Stack>
            ))}
            <Box sx={{ width: '100%', display: 'flex', flexDiretion: 'row', alignItems: 'center' }}>
              {newSubtitleButton}
            </Box>
          </Stack>
        )}
        {!useSubtitles && (
          <>
            {ingredients.map((ingr, index) => singleIngredient(index, ingr))}
            <Stack direction='row' justifyContent='flex-end' alignItems='center' spacing={2}>
              {!ingredient && newIngredientButton()}
              {ingredient && (
                <IngredientEditor ingredient={ingredient} onClose={removeIngredient} onSave={addIngredient} />
              )}
            </Stack>
          </>
        )}
        <div />
      </Stack>
    </Stack>
  );

  const recipeDescriptionColumn = (
    <Stack direction='column' spacing={3} width='95%' maxWidth='720px' marginRight={5} paddingBottom={10}>
      {imageFileUpload}
      {titleEditor}
      {descriptionEditor}
      <Stack direction='column' width='100%' spacing={3} divider={<Divider orientation='horizontal' flexItem />}>
        {durationEditor}
        {tagEditor}
        {ingredientsEditor}
      </Stack>
    </Stack>
  );

  const instructionStepEditor = (
    <Stack direction='column' spacing={1} width='100%'>
      <Stack
        direction='row'
        spacing={2}
        alignItems='center'
        width='100%'
        divider={<Divider orientation='vertical' flexItem />}
      >
        <Typography variant='h3'>{instructionStep?.index}</Typography>
        <TextField
          label='Vaiheen otsikko'
          size='small'
          fullWidth
          autoFocus
          error={missingInstructionStepTitle}
          inputProps={{ maxLength: 100 }}
          value={instructionStep?.title}
          onChange={
            instructionStep
              ? e => {
                  if (missingInstructionStepTitle) setMissingInstructionStepTitle(false);
                  setInstructionStep({ ...instructionStep, title: e.target.value });
                }
              : undefined
          }
        />
      </Stack>
      <TextField
        label='Ohjeet'
        size='small'
        error={missingInstructionStepDescription}
        inputProps={{ maxLength: 1000 }}
        multiline
        rows={3}
        value={instructionStep?.description}
        onChange={
          instructionStep
            ? e => {
                if (missingInstructionStepDescription) setMissingInstructionStepDescription(false);
                setInstructionStep({ ...instructionStep, description: e.target.value });
              }
            : undefined
        }
      />
      <Stack direction='row' spacing={2} justifyContent='flex-end' alignItems='center' width='100%'>
        <Button endIcon={<CloseIcon color='primary' />} onClick={removeInstructionStep}>
          Poista vaihe
        </Button>
        <Button endIcon={<DoneIcon color='primary' />} onClick={addInstructionStep}>
          Tallenna
        </Button>
      </Stack>
    </Stack>
  );

  const instructionsEditor = (
    <Stack direction='column' spacing={2} divider={<Divider orientation='horizontal' flexItem />} width='100%'>
      {invalidInstructions && (
        <Typography variant='body1' color='error'>
          Lisää vähintään 1 valmistusvaihe
        </Typography>
      )}
      {instructions.map(step => (
        <Stack key={step.index} direction='column' width='100%' spacing={1}>
          {instructionStep && instructionStep.index === step.index && instructionStepEditor}
          {!(instructionStep && instructionStep.index === step.index) && (
            <>
              <Stack
                direction='row'
                justifyContent='flex-start'
                alignItems='center'
                divider={<Divider orientation='vertical' flexItem />}
                spacing={2}
              >
                <Typography variant='h3' width={15}>
                  {step.index}
                </Typography>
                <Typography variant='h3'>{step.title}</Typography>
              </Stack>
              <Typography variant='body1' align='justify'>
                {step.description}
              </Typography>
              <Stack direction='row' justifyContent='flex-end' width='100%'>
                <Button
                  endIcon={<EditIcon color='primary' />}
                  onClick={() => {
                    if (instructionStep && (instructionStep.title === '' || instructionStep.description === '')) {
                      removeInstructionStep();
                    }
                    setInstructionStep(step);
                  }}
                  sx={{ fontSize: 18 }}
                >
                  Muokkaa
                </Button>
              </Stack>
            </>
          )}
        </Stack>
      ))}
      {instructionStep && !instructions.find(step => step.index === instructionStep.index) && instructionStepEditor}
      {!instructionStep && (
        <Stack direction='row' spacing={2} alignItems='center'>
          <Button
            startIcon={<AddIcon color='primary' />}
            onClick={() => {
              if (invalidInstructions) setInvalidInstructions(false);
              const newStep: RecipeStep = { index: instructions.length + 1, title: '', description: '', pageNumber: 1 };
              setInstructionStep(newStep);
            }}
            sx={{
              fontSize: 24,
              fontFamily: 'Segoe UI',
              fontWeight: 'lighter',
            }}
          >
            Lisää vaihe
          </Button>
        </Stack>
      )}
      <div />
    </Stack>
  );

  const recipeInstructionsColumn = (
    <Box
      sx={{
        width: '95%',
        maxWidth: '720px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginLeft: 5,
      }}
    >
      <Card
        sx={{
          height: '87vh',
          position: 'sticky',
          top: '20px',
          overflowY: 'auto',
        }}
      >
        <Stack
          direction='column'
          justifyContent='flex-start'
          alignItems='center'
          spacing={3}
          width='90%'
          sx={{ margin: 5 }}
        >
          <Typography variant='h2'>Valmistusohje</Typography>
          {instructionsEditor}
        </Stack>
      </Card>
    </Box>
  );

  const leftColumn = (
    <Stack
      direction='column'
      justifyContent='flex-start'
      alignItems='center'
      spacing={1}
      sx={{
        width: '100%',
        position: 'sticky',
        top: '20px',
      }}
    >
      <Button
        variant='outlined'
        onClick={() => {
          navigate('/recipes');
          dispatch(recipeActions.clearSelectedRecipe());
        }}
      >
        <ArrowBackIcon />
      </Button>
    </Stack>
  );

  const rightColumn = (
    <Stack
      direction='column'
      justifyContent='flex-start'
      alignItems='center'
      spacing={1}
      sx={{
        width: '100%',
        position: 'sticky',
        bottom: '50px',
      }}
    >
      <Button
        variant='outlined'
        color='secondary'
        onClick={recipe ? () => navigate(`/recipes/${recipe.id}`) : () => navigate('/')}
        sx={{ width: '150px' }}
      >
        Peruuta
      </Button>
      <Button variant='contained' color='secondary' onClick={submit} sx={{ width: '150px' }}>
        Tallenna
      </Button>
    </Stack>
  );

  return loading ? (
    <CircularProgress color='secondary' />
  ) : (
    <div style={{ width: '100%', height: '100%', paddingTop: '40px' }}>
      {(error || newRecipe) && (
        <Stack direction='column' justifyContent='center' alignItems='center' spacing={2}>
          <Typography variant='body1'>{error?.message || 'Resepti tallennettu onnistuneesti'}</Typography>
          {newRecipe && (
            <Button
              variant='contained'
              color='secondary'
              onClick={() => {
                navigate(`/recipes/${newRecipe.id}`);
                dispatch(recipeActions.selectRecipe(newRecipe.id));
                dispatch(recipeActions.clearNewRecipe());
              }}
              sx={{ width: '200px' }}
            >
              Avaa resepti
            </Button>
          )}
          {error && (
            <Button
              variant='contained'
              color='secondary'
              onClick={() => {
                navigate('/recipeEditor');
                dispatch(recipeActions.clearError());
              }}
              sx={{ width: '200px' }}
            >
              Muokkaa
            </Button>
          )}
          <Button
            variant='contained'
            color='secondary'
            onClick={() => {
              navigate('/recipes');
              if (error) dispatch(recipeActions.clearError());
              if (newRecipe) dispatch(recipeActions.clearNewRecipe());
            }}
            sx={{ width: '200px' }}
          >
            Palaa etusivulle
          </Button>
        </Stack>
      )}
      {!error && !newRecipe && (
        <Grid container justifyContent='center' rowSpacing={5}>
          <Grid container item xs={1.5} direction='column' alignItems='center'>
            {leftColumn}
          </Grid>
          <Grid
            container
            item
            md={10.5}
            xl={4.5}
            direction='column'
            sx={{
              alignItems: { xs: 'center', md: 'flex-start', xl: 'flex-end' },
            }}
          >
            {recipeDescriptionColumn}
          </Grid>
          <Grid
            container
            item
            md={10.5}
            xl={4.5}
            direction='column'
            sx={{
              alignItems: { xs: 'center', md: 'flex-start' },
              ml: { xs: 0, md: 5, xl: 0 },
            }}
          >
            {recipeInstructionsColumn}
          </Grid>
          <Grid container item xs={1.5} direction='column' justifyContent='flex-end' alignItems='center'>
            {rightColumn}
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default RecipeEditor;
